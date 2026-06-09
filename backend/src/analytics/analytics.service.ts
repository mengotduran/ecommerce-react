import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async summary() {
    const now   = new Date();
    const day30  = new Date(now); day30.setDate(now.getDate() - 30);
    const day60  = new Date(now); day60.setDate(now.getDate() - 60);

    const [
      totalUsers, totalProducts, totalOrders,
      revenueAgg, revenueLastPeriod,
      ordersThisPeriod, ordersLastPeriod,
      usersThisPeriod, usersLastPeriod,
      recentOrders, topProductsRaw,
      ordersByStatus,
      dailyRevenue,
      dailyOrders,
      dailyUsers,
      categoryRevenue,
      lowStock,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.product.count(),
      this.prisma.order.count(),

      // Revenue all time (paid/shipped/delivered)
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] } },
      }),

      // Revenue previous 30-day window (for trend)
      this.prisma.order.aggregate({
        _sum: { total: true },
        where: { status: { in: ['PAID', 'SHIPPED', 'DELIVERED'] }, createdAt: { gte: day60, lt: day30 } },
      }),

      // Orders this 30 days
      this.prisma.order.count({ where: { createdAt: { gte: day30 } } }),
      // Orders previous 30 days
      this.prisma.order.count({ where: { createdAt: { gte: day60, lt: day30 } } }),

      // Users this 30 days
      this.prisma.user.count({ where: { createdAt: { gte: day30 } } }),
      // Users previous 30 days
      this.prisma.user.count({ where: { createdAt: { gte: day60, lt: day30 } } }),

      // Recent orders
      this.prisma.order.findMany({
        take: 6, orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),

      // Top products by units sold
      this.prisma.orderItem.groupBy({
        by: ['productId'], _sum: { quantity: true, price: true },
        orderBy: { _sum: { quantity: 'desc' } }, take: 6,
      }),

      // Orders by status (donut)
      this.prisma.order.groupBy({ by: ['status'], _count: true }),

      // Daily revenue — last 30 days (all statuses except cancelled)
      this.prisma.$queryRaw<{ day: Date; revenue: number }[]>`
        SELECT DATE("createdAt") as day, SUM(total)::float as revenue
        FROM "Order"
        WHERE "createdAt" >= ${day30}
          AND status != 'CANCELLED'
        GROUP BY DATE("createdAt")
        ORDER BY day ASC
      `,

      // Daily order count — last 30 days
      this.prisma.$queryRaw<{ day: Date; count: number }[]>`
        SELECT DATE("createdAt") as day, COUNT(*)::int as count
        FROM "Order"
        WHERE "createdAt" >= ${day30}
        GROUP BY DATE("createdAt")
        ORDER BY day ASC
      `,

      // Daily new users — last 30 days
      this.prisma.$queryRaw<{ day: Date; count: number }[]>`
        SELECT DATE("createdAt") as day, COUNT(*)::int as count
        FROM "User"
        WHERE "createdAt" >= ${day30}
        GROUP BY DATE("createdAt")
        ORDER BY day ASC
      `,

      // Revenue by category
      this.prisma.$queryRaw<{ category: string; revenue: number }[]>`
        SELECT p.category, SUM(oi.price * oi.quantity)::float as revenue
        FROM "OrderItem" oi
        JOIN "Product" p ON oi."productId" = p.id
        JOIN "Order" o ON oi."orderId" = o.id
        WHERE o.status IN ('PAID','SHIPPED','DELIVERED')
        GROUP BY p.category
        ORDER BY revenue DESC
      `,

      // Low stock products
      this.prisma.product.findMany({
        where: { stock: { lte: 5 } },
        select: { id: true, name: true, stock: true, image: true, category: true },
        orderBy: { stock: 'asc' },
        take: 5,
      }),
    ]);

    // Resolve top product details
    const topProducts = await Promise.all(
      topProductsRaw.map((t) =>
        this.prisma.product.findUnique({
          where: { id: t.productId },
          select: { id: true, name: true, image: true, price: true, category: true },
        }).then((p) => ({ ...p, sold: t._sum.quantity, revenue: Number(t._sum.price ?? 0) }))
      )
    );

    const pct = (curr: number, prev: number) =>
      prev === 0 ? null : Math.round(((curr - prev) / prev) * 100);

    const revenueThis  = Number(revenueAgg._sum.total ?? 0);
    const revenuePrev  = Number(revenueLastPeriod._sum.total ?? 0);

    // Fill gaps in daily series with zeros — includes today
    const fillDays = <T extends { day: any; [k: string]: any }>(
      rows: T[], valueKey: string
    ) => {
      const map = new Map<string, number>();
      rows.forEach((r) => {
        // Postgres DATE comes back as JS Date or string depending on driver
        const key = typeof r.day === 'string'
          ? r.day.slice(0, 10)
          : new Date(r.day).toISOString().slice(0, 10);
        map.set(key, Number(r[valueKey]));
      });
      // 30 days inclusive of today: indices 0..29 where 29 = today
      return Array.from({ length: 30 }, (_, i) => {
        const d = new Date(day30); d.setDate(d.getDate() + i + 1);
        const key = d.toISOString().slice(0, 10);
        return { date: key, value: map.get(key) ?? 0 };
      });
    };

    return {
      totalUsers, totalProducts, totalOrders,
      revenue: revenueThis,
      trends: {
        revenue:  pct(revenueThis, revenuePrev),
        orders:   pct(ordersThisPeriod, ordersLastPeriod),
        users:    pct(usersThisPeriod, usersLastPeriod),
      },
      recentOrders,
      topProducts,
      ordersByStatus: ordersByStatus.map((s) => ({ status: s.status, count: s._count })),
      dailyRevenue:   fillDays(dailyRevenue,  'revenue'),
      dailyOrders:    fillDays(dailyOrders,   'count'),
      dailyUsers:     fillDays(dailyUsers,    'count'),
      categoryRevenue: (categoryRevenue as any[]).map((r) => ({ category: r.category, revenue: Number(r.revenue) })),
      lowStock,
    };
  }
}

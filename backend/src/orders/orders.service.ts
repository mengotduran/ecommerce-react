import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(
    userId: string | null,
    data: {
      items: { productId: string; quantity: number; price: number }[];
      email?: string;
      customerName?: string;
      shippingStreet?: string;
      shippingCity?: string;
      shippingZip?: string;
      shippingCountry?: string;
      shippingMethod?: string;
    },
  ) {
    const itemsTotal = data.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const shippingCost = data.shippingMethod === 'express' ? 15 : data.shippingMethod === 'standard' ? 5 : 0;
    const total = itemsTotal + shippingCost;
    return this.prisma.order.create({
      data: {
        userId: userId ?? null,
        total,
        status: 'PENDING',
        email: data.email,
        customerName: data.customerName,
        shippingStreet: data.shippingStreet,
        shippingCity: data.shippingCity,
        shippingZip: data.shippingZip,
        shippingCountry: data.shippingCountry,
        shippingMethod: data.shippingMethod,
        items: { create: data.items.map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.price })) },
      },
      include: { items: { include: { product: { select: { name: true, image: true } } } } },
    });
  }

  findAll() {
    return this.prisma.order.findMany({
      include: { user: { select: { id: true, name: true, email: true } }, items: { include: { product: { select: { name: true, image: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findByUser(userId: string) {
    return this.prisma.order.findMany({
      where: { userId, hiddenByUser: false },
      include: { items: { include: { product: { select: { name: true, image: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  updateStatus(id: string, status: string) {
    return this.prisma.order.update({ where: { id }, data: { status: status as any } });
  }

  // User-facing "delete": hides the order from the user's own order history
  // without removing it, so it still shows on the admin dashboard.
  async hideForUser(id: string, userId: string) {
    const order = await this.prisma.order.findUnique({ where: { id } });
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== userId) throw new ForbiddenException('Not your order');
    return this.prisma.order.update({ where: { id }, data: { hiddenByUser: true } });
  }

  // SUPERADMIN-only: permanently removes the order and its items.
  async remove(id: string) {
    await this.prisma.orderItem.deleteMany({ where: { orderId: id } });
    return this.prisma.order.delete({ where: { id } });
  }
}

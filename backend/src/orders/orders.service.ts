import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, items: { productId: string; quantity: number; price: number }[]) {
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    return this.prisma.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        items: { create: items.map((i) => ({ productId: i.productId, quantity: i.quantity, price: i.price })) },
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
      where: { userId },
      include: { items: { include: { product: { select: { name: true, image: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  updateStatus(id: string, status: string) {
    return this.prisma.order.update({ where: { id }, data: { status: status as any } });
  }
}

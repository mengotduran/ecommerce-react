import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ApprovalsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.approvalRequest.findMany({
      include: { requestedBy: { select: { id: true, name: true, email: true, role: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  findPending() {
    return this.prisma.approvalRequest.findMany({
      where: { status: 'PENDING' },
      include: { requestedBy: { select: { id: true, name: true, email: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  countPending() {
    return this.prisma.approvalRequest.count({ where: { status: 'PENDING' } });
  }

  findByRequester(userId: string) {
    return this.prisma.approvalRequest.findMany({
      where: { requestedById: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async request(type: string, requestedById: string, payload: any, note?: string) {
    const existing = await this.prisma.approvalRequest.findFirst({
      where: { type: type as any, requestedById, status: 'PENDING' },
    });
    if (existing) throw new BadRequestException('An identical request is already pending approval');

    return this.prisma.approvalRequest.create({
      data: { type: type as any, requestedById, payload, note },
      include: { requestedBy: { select: { id: true, name: true, email: true } } },
    });
  }

  async approve(id: string, reason?: string) {
    const req = await this.prisma.approvalRequest.findUnique({ where: { id } });
    if (!req) throw new NotFoundException('Request not found');
    if (req.status !== 'PENDING') throw new BadRequestException('Request already resolved');

    await this.execute(req.type, req.payload as any);

    return this.prisma.approvalRequest.update({ where: { id }, data: { status: 'APPROVED', reason } });
  }

  async reject(id: string, reason?: string) {
    const req = await this.prisma.approvalRequest.findUnique({ where: { id } });
    if (!req) throw new NotFoundException('Request not found');
    if (req.status !== 'PENDING') throw new BadRequestException('Request already resolved');

    return this.prisma.approvalRequest.update({ where: { id }, data: { status: 'REJECTED', reason } });
  }

  private async execute(type: string, payload: any) {
    switch (type) {
      case 'CREATE_PRODUCT':
        await this.prisma.product.create({ data: {
          name:        payload.name,
          description: payload.description,
          price:       payload.price,
          image:       payload.image,
          images:      payload.images ?? [],
          category:    payload.category,
          stock:       payload.stock ?? 0,
          featured:    payload.featured ?? false,
          badge:       payload.badge ?? null,
          features:    payload.features ?? [],
        }});
        break;
      case 'DELETE_PRODUCT':
        await this.prisma.product.delete({ where: { id: payload.productId } });
        break;
      case 'UPDATE_PRODUCT_PRICE':
        await this.prisma.product.update({ where: { id: payload.productId }, data: { price: payload.newPrice } });
        break;
      case 'PROMOTE_USER':
        await this.prisma.user.update({ where: { id: payload.userId }, data: { role: 'ADMIN' } });
        break;
      case 'DEMOTE_ADMIN':
        await this.prisma.user.update({ where: { id: payload.userId }, data: { role: 'CUSTOMER' } });
        break;
      case 'CANCEL_ORDER':
        await this.prisma.order.update({ where: { id: payload.orderId }, data: { status: 'CANCELLED' } });
        break;
    }
  }
}

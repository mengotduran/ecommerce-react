import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
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

    // Apply the underlying change first. If it fails (e.g. deleting a product
    // that has existing orders, or a record that's since been removed),
    // translate the raw Prisma error into a clear message and leave the
    // request PENDING — otherwise Nest masks it as a generic 500 and the
    // approval silently appears to "do nothing".
    try {
      await this.execute(req.type, req.payload as any);
    } catch (e) {
      throw this.toReadableError(e);
    }

    return this.prisma.approvalRequest.update({ where: { id }, data: { status: 'APPROVED', reason } });
  }

  private toReadableError(e: unknown): BadRequestException {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // Foreign-key constraint — almost always deleting a product that has
      // order items, which would corrupt order history.
      if (e.code === 'P2003') {
        return new BadRequestException(
          'Cannot delete this product because it has existing orders. Remove or reassign those orders first.',
        );
      }
      // Record the action targets no longer exists.
      if (e.code === 'P2025') {
        return new BadRequestException('The item this request refers to no longer exists.');
      }
    }
    const message = e instanceof Error ? e.message : 'Unknown error';
    return new BadRequestException(`Could not apply this request: ${message}`);
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
        // Soft delete (see ProductsService.remove) so the product stays in
        // the DB for existing orders instead of hitting the OrderItem FK.
        await this.prisma.product.update({ where: { id: payload.productId }, data: { deletedAt: new Date() } });
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

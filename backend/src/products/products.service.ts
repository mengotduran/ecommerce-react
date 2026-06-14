import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  // Soft-deleted products (deletedAt set) are hidden from the whole store but
  // kept in the DB so existing orders still reference a real product row.
  findAll() { return this.prisma.product.findMany({ where: { deletedAt: null }, orderBy: { createdAt: 'desc' } }); }
  findFeatured() { return this.prisma.product.findMany({ where: { featured: true, deletedAt: null } }); }
  findCatalogue() { return this.prisma.product.findMany({ where: { featured: false, deletedAt: null } }); }
  async findById(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    return product?.deletedAt ? null : product;
  }

  create(dto: CreateProductDto) {
    return this.prisma.product.create({ data: { ...dto, price: dto.price } });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.assertExists(id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  // Soft delete: hide from the store but preserve the row (and therefore
  // order history) rather than failing on the OrderItem foreign key.
  async remove(id: string) {
    await this.assertExists(id);
    return this.prisma.product.update({ where: { id }, data: { deletedAt: new Date() } });
  }

  private async assertExists(id: string) {
    const p = await this.prisma.product.findUnique({ where: { id } });
    if (!p || p.deletedAt) throw new NotFoundException('Product not found');
  }
}

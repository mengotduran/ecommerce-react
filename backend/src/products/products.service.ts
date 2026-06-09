import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() { return this.prisma.product.findMany({ orderBy: { createdAt: 'desc' } }); }
  findFeatured() { return this.prisma.product.findMany({ where: { featured: true } }); }
  findCatalogue() { return this.prisma.product.findMany({ where: { featured: false } }); }
  findById(id: string) { return this.prisma.product.findUnique({ where: { id } }); }

  create(dto: CreateProductDto) {
    return this.prisma.product.create({ data: { ...dto, price: dto.price } });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.assertExists(id);
    return this.prisma.product.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.assertExists(id);
    return this.prisma.product.delete({ where: { id } });
  }

  private async assertExists(id: string) {
    const p = await this.prisma.product.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Product not found');
  }
}

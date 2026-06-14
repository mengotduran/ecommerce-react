import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { featured as featuredSeed, catalogue as catalogueSeed } from '../../prisma/seed';

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

  // Admin: list soft-deleted products so they can be restored.
  findDeleted() {
    return this.prisma.product.findMany({ where: { deletedAt: { not: null } }, orderBy: { deletedAt: 'desc' } });
  }

  async restore(id: string) {
    const p = await this.prisma.product.findUnique({ where: { id } });
    if (!p) throw new NotFoundException('Product not found');
    return this.prisma.product.update({ where: { id }, data: { deletedAt: null } });
  }

  // Restore every soft-deleted product in one shot.
  restoreAll() {
    return this.prisma.product.updateMany({ where: { deletedAt: { not: null } }, data: { deletedAt: null } });
  }

  // Re-create any seed product that's missing by name (hard-deleted before
  // soft-delete existed, so it's gone from the DB and can't be restored).
  // Skips products that already exist; never touches orders.
  async restoreSeed() {
    const ensure = async (list: any[], isFeatured: boolean) => {
      let created = 0;
      for (const p of list) {
        const exists = await this.prisma.product.findFirst({ where: { name: p.name } });
        if (exists) continue;
        await this.prisma.product.create({
          data: {
            name: p.name,
            description: p.description,
            price: p.price,
            category: p.category,
            image: p.images[0],
            images: p.images,
            features: p.features,
            stock: 5,
            featured: isFeatured,
            badge: isFeatured ? null : (p.badge ?? null),
          },
        });
        created++;
      }
      return created;
    };
    const created = (await ensure(featuredSeed, true)) + (await ensure(catalogueSeed, false));
    return { created };
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

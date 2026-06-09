import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/product.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ApprovalsService } from '../approvals/approvals.service';

@Controller('products')
export class ProductsController {
  constructor(
    private readonly productsService: ProductsService,
    private readonly approvals: ApprovalsService,
  ) {}

  @Get() findAll() { return this.productsService.findAll(); }
  @Get('featured') findFeatured() { return this.productsService.findFeatured(); }
  @Get('catalogue') findCatalogue() { return this.productsService.findCatalogue(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.productsService.findById(id); }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')
  async create(@Body() dto: CreateProductDto, @CurrentUser() user: any) {
    if (user.role === 'ADMIN') {
      return this.approvals.request('CREATE_PRODUCT', user.id, { ...dto, productName: dto.name });
    }
    return this.productsService.create(dto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')
  async update(@Param('id') id: string, @Body() dto: UpdateProductDto, @CurrentUser() user: any) {
    // Price change by ADMIN requires approval
    if (dto.price !== undefined && user.role === 'ADMIN') {
      const current = await this.productsService.findById(id);
      return this.approvals.request('UPDATE_PRODUCT_PRICE', user.id, { productId: id, newPrice: dto.price, oldPrice: Number(current?.price), productName: current?.name });
    }
    return this.productsService.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')
  async remove(@Param('id') id: string, @CurrentUser() user: any, @Body('note') note?: string) {
    // ADMIN submits for approval; SUPERADMIN deletes directly
    if (user.role === 'ADMIN') {
      const product = await this.productsService.findById(id);
      return this.approvals.request('DELETE_PRODUCT', user.id, { productId: id, productName: product?.name }, note);
    }
    return this.productsService.remove(id);
  }
}

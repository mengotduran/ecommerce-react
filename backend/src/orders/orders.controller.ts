import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../auth/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

type CreateOrderBody = {
  items: { productId: string; quantity: number; price: number }[];
  email?: string;
  customerName?: string;
  shippingStreet?: string;
  shippingCity?: string;
  shippingZip?: string;
  shippingCountry?: string;
  shippingMethod?: string;
};

@Controller('orders')
export class OrdersController {
  constructor(private orders: OrdersService) {}

  // Guest checkout: works with or without a token. When logged in, the order
  // is attached to the user; when not, it's stored with the contact/shipping
  // details captured on the form.
  @Post()
  @UseGuards(OptionalJwtAuthGuard)
  create(@CurrentUser() user: any, @Body() body: CreateOrderBody) {
    return this.orders.create(user?.id ?? null, body);
  }

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  myOrders(@CurrentUser() user: any) { return this.orders.findByUser(user.id); }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')
  all() { return this.orders.findAll(); }

  @Patch(':id/status')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('ADMIN')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.orders.updateStatus(id, status);
  }

  // Any signed-in user can remove an order from their own order history.
  // It stays on the admin dashboard — only hidden for the user.
  @Patch(':id/hide')
  @UseGuards(JwtAuthGuard)
  hide(@Param('id') id: string, @CurrentUser() user: any) {
    return this.orders.hideForUser(id, user.id);
  }

  // SUPERADMIN-only: permanently deletes the order.
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard) @Roles('SUPERADMIN')
  remove(@Param('id') id: string) {
    return this.orders.remove(id);
  }
}

import { Controller, Get, Post, Patch, Param, Body, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('orders')
@UseGuards(JwtAuthGuard)
export class OrdersController {
  constructor(private orders: OrdersService) {}

  @Post()
  create(@CurrentUser() user: any, @Body() body: { items: { productId: string; quantity: number; price: number }[] }) {
    return this.orders.create(user.id, body.items);
  }

  @Get('mine')
  myOrders(@CurrentUser() user: any) { return this.orders.findByUser(user.id); }

  @Get()
  @UseGuards(RolesGuard) @Roles('ADMIN')
  all() { return this.orders.findAll(); }

  @Patch(':id/status')
  @UseGuards(RolesGuard) @Roles('ADMIN')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.orders.updateStatus(id, status);
  }
}

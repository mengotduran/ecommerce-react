import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { ApprovalsService } from '../approvals/approvals.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class UsersController {
  constructor(
    private users: UsersService,
    private prisma: PrismaService,
    private approvals: ApprovalsService,
  ) {}

  @Get()
  findAll() {
    return this.prisma.user.findMany({
      select: { id: true, name: true, email: true, role: true, createdAt: true, _count: { select: { orders: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  // SUPERADMIN: create an admin directly
  @Post()
  @Roles('SUPERADMIN')
  createAdmin(@Body() body: { name: string; email: string; password: string }) {
    return this.users.create(body.email, body.password, body.name).then(async (u) => {
      await this.prisma.user.update({ where: { id: u.id }, data: { role: 'ADMIN' } });
      return { ...u, role: 'ADMIN' };
    });
  }

  // SUPERADMIN: set role directly
  @Patch(':id/role')
  @Roles('SUPERADMIN')
  updateRole(@Param('id') id: string, @Body('role') role: string) {
    return this.prisma.user.update({ where: { id }, data: { role: role as any }, select: { id: true, name: true, email: true, role: true } });
  }

  // ADMIN: request promotion of a customer to admin (needs SUPERADMIN approval)
  @Post(':id/request-promote')
  @Roles('ADMIN')
  async requestPromote(@Param('id') id: string, @CurrentUser() user: any, @Body('note') note?: string) {
    const target = await this.prisma.user.findUnique({ where: { id }, select: { name: true, email: true, role: true } });
    return this.approvals.request('PROMOTE_USER', user.id, { userId: id, userName: target?.name, userEmail: target?.email }, note);
  }

  // ADMIN: request demotion of an admin (needs SUPERADMIN approval)
  @Post(':id/request-demote')
  @Roles('ADMIN')
  async requestDemote(@Param('id') id: string, @CurrentUser() user: any, @Body('note') note?: string) {
    const target = await this.prisma.user.findUnique({ where: { id }, select: { name: true, email: true, role: true } });
    return this.approvals.request('DEMOTE_ADMIN', user.id, { userId: id, userName: target?.name, userEmail: target?.email }, note);
  }

  // SUPERADMIN: delete a user
  @Delete(':id')
  @Roles('SUPERADMIN')
  deleteUser(@Param('id') id: string) {
    return this.prisma.user.delete({ where: { id }, select: { id: true, name: true, email: true } });
  }
}

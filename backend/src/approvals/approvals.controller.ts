import { Controller, Get, Post, Patch, Body, Param, UseGuards } from '@nestjs/common';
import { ApprovalsService } from './approvals.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('approvals')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ApprovalsController {
  constructor(private approvals: ApprovalsService) {}

  // Admin: submit a request
  @Post()
  @Roles('ADMIN')
  request(@CurrentUser() user: any, @Body() body: { type: string; payload: any; note?: string }) {
    return this.approvals.request(body.type, user.id, body.payload, body.note);
  }

  // Admin: see their own requests
  @Get('mine')
  @Roles('ADMIN')
  mine(@CurrentUser() user: any) {
    return this.approvals.findByRequester(user.id);
  }

  // Superadmin: see all pending
  @Get('pending')
  @Roles('SUPERADMIN')
  pending() { return this.approvals.findPending(); }

  // Superadmin: see all (history)
  @Get()
  @Roles('SUPERADMIN')
  all() { return this.approvals.findAll(); }

  // Superadmin: pending count (for badge)
  @Get('count')
  @Roles('SUPERADMIN')
  async count() { return { count: await this.approvals.countPending() }; }

  // Superadmin: approve
  @Patch(':id/approve')
  @Roles('SUPERADMIN')
  approve(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.approvals.approve(id, reason);
  }

  // Superadmin: reject
  @Patch(':id/reject')
  @Roles('SUPERADMIN')
  reject(@Param('id') id: string, @Body('reason') reason?: string) {
    return this.approvals.reject(id, reason);
  }
}

import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';
import { ApprovalsModule } from '../approvals/approvals.module';

@Module({
  imports: [PrismaModule, forwardRef(() => AuthModule), forwardRef(() => ApprovalsModule)],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}

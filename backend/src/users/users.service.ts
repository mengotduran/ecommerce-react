import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }

  async create(email: string, password: string, name: string) {
    const exists = await this.findByEmail(email);
    if (exists) throw new ConflictException('Email already in use');
    const hashed = await bcrypt.hash(password, 10);
    return this.prisma.user.create({
      data: { email, password: hashed, name },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });
  }
}

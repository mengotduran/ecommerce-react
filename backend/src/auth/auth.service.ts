import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(
    private users: UsersService,
    private jwt: JwtService,
  ) {}

  async register(name: string, email: string, password: string) {
    const user = await this.users.create(email, password, name);
    return { user, token: this.sign(user) };
  }

  async login(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');
    const { password: _, ...safe } = user;
    return { user: safe, token: this.sign(safe) };
  }

  private sign(user: { id: string; email: string; role: string }) {
    return this.jwt.sign({ sub: user.id, email: user.email, role: user.role });
  }
}

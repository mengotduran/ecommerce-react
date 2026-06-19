import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// Like JwtAuthGuard, but never rejects the request. If a valid token is
// present, req.user is populated; otherwise it stays null. Used for endpoints
// that work for both logged-in users and guests (e.g. guest checkout).
@Injectable()
export class OptionalJwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(_err: any, user: any) {
    return user || null;
  }
}

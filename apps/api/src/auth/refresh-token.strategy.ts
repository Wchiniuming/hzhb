import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor() {
    super({
      jwtFromRequest: (req: any) => req.body?.refreshToken,
      ignoreExpiration: false,
      algorithms: ['RS256'] as any,
      secretOrKey: process.env.JWT_PUBLIC_KEY || 'temp-key',
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username };
  }
}
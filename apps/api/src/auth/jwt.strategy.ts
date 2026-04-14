import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH || path.join(__dirname, 'keys/public.pem');
    const publicKey = fs.readFileSync(publicKeyPath, 'utf8');
    
    super({
      jwtFromRequest: (req) => {
        const authHeader = req?.headers?.authorization;
        if (authHeader?.startsWith('Bearer ')) {
          return authHeader.substring(7);
        }
        return null;
      },
      ignoreExpiration: false,
      algorithms: ['RS256'] as any,
      secretOrKey: publicKey,
    });
  }

  async validate(payload: any) {
    return { userId: payload.sub, username: payload.username, role: payload.role };
  }
}
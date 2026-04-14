import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { RefreshTokenStrategy } from './refresh-token.strategy';
import { JwtAuthGuard } from './auth.guard';
import { RolesGuard } from './roles.guard';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from '../prisma/prisma.module';
import * as fs from 'fs';
import * as path from 'path';

const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH || path.join(__dirname, 'keys/private.pem');
const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH || path.join(__dirname, 'keys/public.pem');

@Module({
  imports: [
    PassportModule,
    PrismaModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        privateKey: fs.readFileSync(privateKeyPath, 'utf8'),
        publicKey: fs.readFileSync(publicKeyPath, 'utf8'),
        signOptions: { expiresIn: 3600, algorithm: 'RS256' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    RefreshTokenStrategy,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
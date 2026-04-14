import { registerAs } from '@nestjs/config';
import * as fs from 'fs';
import * as path from 'path';

export default registerAs('jwt', () => {
  const privateKeyPath = process.env.JWT_PRIVATE_KEY_PATH || path.join(__dirname, '../../src/auth/keys/private.pem');
  const publicKeyPath = process.env.JWT_PUBLIC_KEY_PATH || path.join(__dirname, '../../src/auth/keys/public.pem');
  
  return {
    privateKey: fs.readFileSync(privateKeyPath, 'utf8'),
    publicKey: fs.readFileSync(publicKeyPath, 'utf8'),
    signOptions: {
      algorithm: 'RS256' as const,
      expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY || '15m',
    },
    refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d',
  };
});

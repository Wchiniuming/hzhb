import { User } from '@prisma/client';
import { Exclude } from 'class-transformer';

export class TokenResponseDto {
  accessToken!: string;
  refreshToken!: string;
  expiresIn!: number;

  @Exclude()
  password?: string;
  
  user!: Omit<User, 'password'>;

  constructor(partial: Partial<TokenResponseDto>) {
    Object.assign(this, partial);
  }
}

import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { TokenResponseDto } from './dto/token-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<TokenResponseDto> {
    const existingUser = await this.prisma.user.findUnique({
      where: { username: registerDto.username },
    });

    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const hashedPassword = await bcrypt.hash(registerDto.password, 12);
    const role = await this.prisma.role.findFirst({ where: { name: 'DEVELOPER' } });

    const user = await this.prisma.user.create({
      data: {
        username: registerDto.username,
        passwordHash: hashedPassword,
        name: registerDto.name,
        email: registerDto.email,
        phone: registerDto.phone,
        roleId: role?.id || '',
      },
      include: { role: true },
    });

    return this.generateTokens(user);
  }

  async login(loginDto: LoginDto): Promise<TokenResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { username: loginDto.username },
      include: { role: true },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    await this.prisma.loginLog.create({ data: { userId: user.id, success: true } });
    return this.generateTokens(user);
  }

  async refreshTokens(userId: string): Promise<TokenResponseDto> {
    const user = await this.prisma.user.findUnique({ where: { id: userId }, include: { role: true } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return this.generateTokens(user);
  }

  async logout(): Promise<void> {
    return;
  }

  private async generateTokens(user: any): Promise<TokenResponseDto> {
    const payload = { sub: user.id, username: user.username, role: user.role?.name || 'DEVELOPER' };
    const accessToken = await this.jwtService.signAsync(payload);
    const expiresIn = 3600;
    const { passwordHash, ...userWithoutPassword } = user;
    return new TokenResponseDto({
      accessToken,
      refreshToken: '',
      expiresIn,
      user: userWithoutPassword,
    });
  }
}
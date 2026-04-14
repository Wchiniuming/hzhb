import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, limit: number, search?: string) {
    const skip = (page - 1) * limit;
    const where: any = search ? {
      OR: [
        { username: { contains: search } },
        { name: { contains: search } },
        { email: { contains: search } },
      ],
    } : {};

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        include: { role: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map(u => ({ ...u, passwordHash: undefined })),
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    const { passwordHash, ...result } = user;
    return result;
  }

  async create(createUserDto: { username: string; password: string; name?: string; email?: string; phone?: string; roleId: string }) {
    const existing = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });
    if (existing) throw new ConflictException('Username already exists');

    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        username: createUserDto.username,
        passwordHash: hashedPassword,
        name: createUserDto.name,
        email: createUserDto.email,
        phone: createUserDto.phone,
        roleId: createUserDto.roleId,
      },
      include: { role: true },
    });

    const { passwordHash, ...result } = user;
    return result;
  }

  async update(id: string, updateUserDto: { name?: string; email?: string; phone?: string; roleId?: string; enabled?: boolean }) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    const updated = await this.prisma.user.update({
      where: { id },
      data: updateUserDto,
      include: { role: true },
    });
    const { passwordHash, ...result } = updated;
    return result;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    await this.prisma.user.update({
      where: { id },
      data: { enabled: false },
    });
  }

  async changePassword(id: string, changePasswordDto: { oldPassword: string; newPassword: string }) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);

    const isValid = await bcrypt.compare(changePasswordDto.oldPassword, user.passwordHash);
    if (!isValid) throw new ConflictException('Old password is incorrect');

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 12);
    await this.prisma.user.update({
      where: { id },
      data: { passwordHash: hashedPassword },
    });
  }
}
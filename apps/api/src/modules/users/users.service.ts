import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page: number;
    pageSize: number;
    search?: string;
    roleId?: string;
  }) {
    const { page, pageSize, search, roleId } = params;
    const skip = (page - 1) * pageSize;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { username: { contains: search } },
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }
    
    if (roleId) {
      where.roleId = roleId;
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: pageSize,
        include: { role: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      items: users.map(u => {
        const { passwordHash, ...result } = u;
        return result;
      }),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
    if (!user) throw new NotFoundException(`用户不存在: ${id}`);
    const { passwordHash, ...result } = user;
    return result;
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      include: { role: true },
    });
  }

  async create(createUserDto: {
    username: string;
    password: string;
    name?: string;
    email?: string;
    phone?: string;
    roleId: string;
  }) {
    const existing = await this.prisma.user.findUnique({
      where: { username: createUserDto.username },
    });
    if (existing) throw new ConflictException('用户名已存在');

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

  async update(id: string, updateUserDto: {
    name?: string;
    email?: string;
    phone?: string;
    roleId?: string;
    enabled?: boolean;
  }) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`用户不存在: ${id}`);

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
    if (!user) throw new NotFoundException(`用户不存在: ${id}`);
    
    await this.prisma.user.update({
      where: { id },
      data: { enabled: false },
    });
  }

  async changePassword(id: string, changePasswordDto: { oldPassword: string; newPassword: string }) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`用户不存在: ${id}`);

    const isValid = await bcrypt.compare(changePasswordDto.oldPassword, user.passwordHash);
    if (!isValid) throw new BadRequestException('原密码错误');

    const hashedPassword = await bcrypt.hash(changePasswordDto.newPassword, 12);
    await this.prisma.user.update({
      where: { id },
      data: { passwordHash: hashedPassword },
    });
    
    return { success: true, message: '密码修改成功' };
  }

  async updateProfile(id: string, updateProfileDto: { name?: string; email?: string; phone?: string }) {
    return this.update(id, updateProfileDto);
  }

  async updateStatus(id: string, enabled: boolean) {
    return this.update(id, { enabled });
  }

  async getPermissions(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: {
          include: {
            permissions: {
              include: { permission: true },
            },
          },
        },
      },
    });
    
    if (!user) throw new NotFoundException(`用户不存在: ${id}`);

    const permissions = user.role?.permissions?.map(rp => rp.permission) || [];
    return {
      role: user.role?.name,
      permissions: permissions.map(p => ({
        id: p.id,
        name: p.name,
        module: p.module,
        action: p.action,
      })),
    };
  }

  async getStats() {
    const [total, byRole, recentUsers] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.role.findMany({
        include: {
          _count: { select: { users: true } },
        },
      }),
      this.prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: { role: true },
      }),
    ]);

    return {
      total,
      byRole: byRole.map(r => ({
        name: r.name,
        description: r.description,
        count: (r as any)._count?.users || 0,
      })),
      recentUsers: recentUsers.map(u => {
        const { passwordHash, ...result } = u;
        return result;
      }),
    };
  }
}

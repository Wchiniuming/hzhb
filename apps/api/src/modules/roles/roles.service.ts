import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, pageSize: number) {
    const skip = (page - 1) * pageSize;
    
    const [roles, total] = await Promise.all([
      this.prisma.role.findMany({
        skip,
        take: pageSize,
        include: {
          _count: { select: { users: true } },
          permissions: { include: { permission: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.role.count(),
    ]);

    return {
      items: roles.map(r => ({
        ...r,
        userCount: (r as any)._count?.users || 0,
        permissions: r.permissions.map(p => p.permission),
      })),
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async findAllSimple() {
    const roles = await this.prisma.role.findMany({
      orderBy: { name: 'asc' },
    });
    return roles;
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: {
        _count: { select: { users: true } },
        permissions: { include: { permission: true } },
      },
    });
    if (!role) throw new NotFoundException(`角色不存在: ${id}`);
    return {
      ...role,
      userCount: (role as any)._count?.users || 0,
      permissions: role.permissions.map(p => p.permission),
    };
  }

  async create(createRoleDto: { name: string; description?: string; permissionIds?: string[] }) {
    const existing = await this.prisma.role.findUnique({
      where: { name: createRoleDto.name },
    });
    if (existing) throw new ConflictException('角色名称已存在');

    const { permissionIds, ...roleData } = createRoleDto;

    const role = await this.prisma.role.create({
      data: {
        ...roleData,
        permissions: permissionIds ? {
          create: permissionIds.map(permissionId => ({
            permissionId,
          })),
        } : undefined,
      },
      include: {
        permissions: { include: { permission: true } },
      },
    });

    return {
      ...role,
      permissions: role.permissions.map(p => p.permission),
    };
  }

  async update(id: string, updateRoleDto: { name?: string; description?: string; permissionIds?: string[] }) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException(`角色不存在: ${id}`);

    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existing = await this.prisma.role.findUnique({
        where: { name: updateRoleDto.name },
      });
      if (existing) throw new ConflictException('角色名称已存在');
    }

    const { permissionIds, ...roleData } = updateRoleDto;

    if (permissionIds) {
      await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });
    }

    const updated = await this.prisma.role.update({
      where: { id },
      data: {
        ...roleData,
        permissions: permissionIds ? {
          create: permissionIds.map(permissionId => ({
            permissionId,
          })),
        } : undefined,
      },
      include: {
        permissions: { include: { permission: true } },
      },
    });

    return {
      ...updated,
      permissions: updated.permissions.map(p => p.permission),
    };
  }

  async remove(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { _count: { select: { users: true } } },
    });
    if (!role) throw new NotFoundException(`角色不存在: ${id}`);
    
    if ((role as any)._count?.users > 0) {
      throw new BadRequestException('该角色下有用户，无法删除');
    }

    await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });
    await this.prisma.role.delete({ where: { id } });
  }
}

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.permission.findMany({
      orderBy: [{ module: 'asc' }, { action: 'asc' }],
    });
  }

  async findAllGroupedByModule() {
    const permissions = await this.prisma.permission.findMany({
      orderBy: { name: 'asc' },
    });

    const grouped = permissions.reduce((acc, perm) => {
      if (!acc[perm.module]) {
        acc[perm.module] = [];
      }
      acc[perm.module].push(perm);
      return acc;
    }, {} as Record<string, any[]>);

    return Object.entries(grouped).map(([module, permissions]) => ({
      module,
      permissions,
    }));
  }

  async create(createDto: { name: string; module: string; action: string; description?: string }) {
    return this.prisma.permission.create({
      data: createDto,
    });
  }

  async findOne(id: string) {
    return this.prisma.permission.findUnique({ where: { id } });
  }

  async update(id: string, updateDto: { name?: string; module?: string; action?: string; description?: string }) {
    return this.prisma.permission.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: string) {
    await this.prisma.rolePermission.deleteMany({ where: { permissionId: id } });
    await this.prisma.permission.delete({ where: { id } });
  }
}

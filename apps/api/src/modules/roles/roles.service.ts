import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.role.findMany({
      include: { permissions: { include: { permission: true } } },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id },
      include: { permissions: { include: { permission: true } } },
    });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
    return role;
  }

  async create(createRoleDto: CreateRoleDto) {
    const { permissionIds, ...roleData } = createRoleDto;
    return this.prisma.role.create({
      data: {
        ...roleData,
        permissions: permissionIds ? {
          create: permissionIds.map(permissionId => ({
            permissionId,
          })),
        } : undefined,
      },
      include: { permissions: { include: { permission: true } } },
    });
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);

    const { permissionIds, ...roleData } = updateRoleDto;

    if (permissionIds) {
      await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });
    }

    return this.prisma.role.update({
      where: { id },
      data: {
        ...roleData,
        permissions: permissionIds ? {
          create: permissionIds.map(permissionId => ({
            permissionId,
          })),
        } : undefined,
      },
      include: { permissions: { include: { permission: true } } },
    });
  }

  async remove(id: string) {
    const role = await this.prisma.role.findUnique({ where: { id } });
    if (!role) throw new NotFoundException(`Role with ID ${id} not found`);
    await this.prisma.role.delete({ where: { id } });
  }

  async findAllPermissions() {
    return this.prisma.permission.findMany({ orderBy: { name: 'asc' } });
  }

  async createPermission(name: string, module: string, action: string, description?: string) {
    return this.prisma.permission.create({
      data: { name, module, action, description },
    });
  }
}
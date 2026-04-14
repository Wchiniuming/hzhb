import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  HttpCode, HttpStatus,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { PermissionsService } from './roles.service';

@Controller('roles')
export class RolesController {
  constructor(
    private readonly rolesService: RolesService,
    private readonly permissionsService: PermissionsService,
  ) {}

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    return this.rolesService.findAll(parseInt(page), parseInt(pageSize));
  }

  @Get('all')
  async findAllSimple() {
    return this.rolesService.findAllSimple();
  }

  @Get('permissions')
  async getAllPermissions() {
    return this.permissionsService.findAllGroupedByModule();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createRoleDto: {
      name: string;
      description?: string;
      permissionIds?: string[];
    }
  ) {
    return this.rolesService.create(createRoleDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: {
      name?: string;
      description?: string;
      permissionIds?: string[];
    }
  ) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.rolesService.remove(id);
  }

  @Post('permissions')
  @HttpCode(HttpStatus.CREATED)
  async createPermission(
    @Body() body: { name: string; module: string; action: string; description?: string },
  ) {
    return this.permissionsService.create(body);
  }

  @Get('permissions/all')
  async findAllPermissions() {
    return this.permissionsService.findAll();
  }
}

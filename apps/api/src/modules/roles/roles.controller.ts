import {
  Controller, Get, Post, Put, Delete, Body, Param,
  HttpCode, HttpStatus, ParseUUIDPipe,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto, UpdateRoleDto } from './dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  async findAll() {
    return this.rolesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createRoleDto: CreateRoleDto) {
    return this.rolesService.create(createRoleDto);
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.rolesService.update(id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.rolesService.remove(id);
  }

  @Get('permissions/all')
  async findAllPermissions() {
    return this.rolesService.findAllPermissions();
  }

  @Post('permissions')
  @HttpCode(HttpStatus.CREATED)
  async createPermission(
    @Body() body: { name: string; module: string; action: string; description?: string },
  ) {
    return this.rolesService.createPermission(body.name, body.module, body.action, body.description);
  }
}
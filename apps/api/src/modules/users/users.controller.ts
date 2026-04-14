import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  HttpCode, HttpStatus, ParseUUIDPipe, DefaultValuePipe, ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../../auth/current-user.decorator';
import * as bcrypt from 'bcrypt';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('pageSize', new DefaultValuePipe(10), ParseIntPipe) pageSize: number,
    @Query('search') search?: string,
    @Query('roleId') roleId?: string,
  ) {
    return this.usersService.findAll({ page, pageSize, search, roleId });
  }

  @Get('stats')
  async getStats() {
    return this.usersService.getStats();
  }

  @Get('me')
  async getCurrentUser(@CurrentUser() user: any) {
    return this.usersService.findOne(user.userId);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createUserDto: {
      username: string;
      password: string;
      name?: string;
      email?: string;
      phone?: string;
      roleId: string;
    }
  ) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: {
      name?: string;
      email?: string;
      phone?: string;
      roleId?: string;
      enabled?: boolean;
    }
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

  @Put(':id/password')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Param('id') id: string,
    @Body() changePasswordDto: { oldPassword: string; newPassword: string },
  ) {
    return this.usersService.changePassword(id, changePasswordDto);
  }

  @Put('profile')
  async updateProfile(
    @CurrentUser() user: any,
    @Body() updateProfileDto: { name?: string; email?: string; phone?: string },
  ) {
    return this.usersService.updateProfile(user.userId, updateProfileDto);
  }

  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { enabled: boolean },
  ) {
    return this.usersService.updateStatus(id, body.enabled);
  }

  @Get(':id/permissions')
  async getPermissions(@Param('id') id: string) {
    return this.usersService.getPermissions(id);
  }
}

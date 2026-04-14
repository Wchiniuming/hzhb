import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  HttpCode, HttpStatus, ParseUUIDPipe, DefaultValuePipe, ParseIntPipe,
} from '@nestjs/common';
import { RisksService } from './risks.service';
import { CreateRiskTypeDto, UpdateRiskTypeDto, CreateRiskDto, UpdateRiskDto } from './dto';
import { CurrentUser } from '../../auth/current-user.decorator';

@Controller('risks')
export class RisksController {
  constructor(private readonly risksService: RisksService) {}

  @Get('types')
  async findAllRiskTypes() {
    return this.risksService.findAllRiskTypes();
  }

  @Post('types')
  @HttpCode(HttpStatus.CREATED)
  async createRiskType(@Body() createDto: CreateRiskTypeDto) {
    return this.risksService.createRiskType(createDto);
  }

  @Put('types/:id')
  async updateRiskType(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateRiskTypeDto,
  ) {
    return this.risksService.updateRiskType(id, updateDto);
  }

  @Delete('types/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeRiskType(@Param('id', ParseUUIDPipe) id: string) {
    return this.risksService.removeRiskType(id);
  }

  @Get()
  async findAllRisks(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('typeId') typeId?: string,
    @Query('level') level?: string,
  ) {
    return this.risksService.findAllRisks(page, limit, typeId, level);
  }

  @Get(':id')
  async findOneRisk(@Param('id', ParseUUIDPipe) id: string) {
    return this.risksService.findOneRisk(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createRisk(@Body() createDto: CreateRiskDto, @CurrentUser() user: any) {
    return this.risksService.createRisk(createDto, user?.id || 'system');
  }

  @Put(':id')
  async updateRisk(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateRiskDto,
  ) {
    return this.risksService.updateRisk(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeRisk(@Param('id', ParseUUIDPipe) id: string) {
    return this.risksService.removeRisk(id);
  }
}
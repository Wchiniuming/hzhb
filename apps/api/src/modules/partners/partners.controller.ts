import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  Patch,
} from '@nestjs/common';
import { PartnersService } from './partners.service';

@Controller('partners')
export class PartnersController {
  constructor(private readonly partnersService: PartnersService) {}

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
    @Query('search') search?: string,
    @Query('status') status?: string,
  ) {
    return this.partnersService.findAll({
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      search,
      status,
    });
  }

  @Get('stats')
  async getStats() {
    return this.partnersService.getStats();
  }

  @Get('all')
  async findAllSimple() {
    return this.partnersService.findAllSimple();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.partnersService.findOne(id);
  }

  @Get(':id/details')
  async getDetails(@Param('id') id: string) {
    return this.partnersService.getDetails(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createPartnerDto: {
      name: string;
      contactInfo?: any;
      status?: string;
    }
  ) {
    return this.partnersService.create(createPartnerDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePartnerDto: {
      name?: string;
      contactInfo?: any;
      status?: string;
    }
  ) {
    return this.partnersService.update(id, updatePartnerDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.partnersService.remove(id);
  }

  @Post(':id/soft-delete')
  @HttpCode(HttpStatus.OK)
  async softDelete(@Param('id') id: string) {
    return this.partnersService.softDelete(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.partnersService.updateStatus(id, body.status);
  }
}

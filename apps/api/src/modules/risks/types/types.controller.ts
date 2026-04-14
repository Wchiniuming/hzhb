import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { RiskTypeService } from './types.service';
import { CreateRiskTypeDto } from '../dto/create-risk-type.dto';
import { UpdateRiskTypeDto } from '../dto/update-risk-type.dto';

@Controller('risks/types')
export class RiskTypeController {
  constructor(private readonly riskTypeService: RiskTypeService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRiskTypeDto: CreateRiskTypeDto) {
    return this.riskTypeService.create(createRiskTypeDto);
  }

  @Get()
  findAll() {
    return this.riskTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.riskTypeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateRiskTypeDto: UpdateRiskTypeDto,
  ) {
    return this.riskTypeService.update(id, updateRiskTypeDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.riskTypeService.remove(id);
  }
}
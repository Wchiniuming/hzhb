import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CreateRiskTypeDto } from '../dto/create-risk-type.dto';
import { UpdateRiskTypeDto } from '../dto/update-risk-type.dto';

@Injectable()
export class RiskTypeService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRiskTypeDto: CreateRiskTypeDto) {
    return this.prisma.riskType.create({
      data: createRiskTypeDto,
    });
  }

  async findAll() {
    return this.prisma.riskType.findMany({
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const riskType = await this.prisma.riskType.findUnique({
      where: { id },
    });

    if (!riskType) {
      throw new NotFoundException(`RiskType with ID ${id} not found`);
    }

    return riskType;
  }

  async update(id: string, updateRiskTypeDto: UpdateRiskTypeDto) {
    try {
      return await this.prisma.riskType.update({
        where: { id },
        data: updateRiskTypeDto,
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`RiskType with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.riskType.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException(`RiskType with ID ${id} not found`);
      }
      throw error;
    }
  }
}
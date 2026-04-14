import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RisksService {
  constructor(private prisma: PrismaService) {}

  async findAllRiskTypes() {
    return this.prisma.riskType.findMany({ orderBy: { name: 'asc' } });
  }

  async createRiskType(createDto: { name: string; parentId?: string; description?: string }) {
    return this.prisma.riskType.create({ data: createDto });
  }

  async updateRiskType(id: string, updateDto: { name?: string; parentId?: string; description?: string }) {
    const riskType = await this.prisma.riskType.findUnique({ where: { id } });
    if (!riskType) throw new NotFoundException(`RiskType with ID ${id} not found`);
    return this.prisma.riskType.update({ where: { id }, data: updateDto });
  }

  async removeRiskType(id: string) {
    const riskType = await this.prisma.riskType.findUnique({ where: { id } });
    if (!riskType) throw new NotFoundException(`RiskType with ID ${id} not found`);
    await this.prisma.riskType.delete({ where: { id } });
  }

  async findAllRisks(page: number, limit: number, typeId?: string, level?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (typeId) where.typeId = typeId;
    if (level) where.level = level;

    const [risks, total] = await Promise.all([
      this.prisma.risk.findMany({ where, skip, take: limit }),
      this.prisma.risk.count({ where }),
    ]);

    return { data: risks, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOneRisk(id: string) {
    const risk = await this.prisma.risk.findUnique({ where: { id } });
    if (!risk) throw new NotFoundException(`Risk with ID ${id} not found`);
    return risk;
  }

  async createRisk(createDto: any, createdBy: string) {
    const riskType = await this.prisma.riskType.findUnique({ where: { id: createDto.typeId } });
    if (!riskType) throw new NotFoundException(`RiskType with ID ${createDto.typeId} not found`);

    return this.prisma.risk.create({
      data: {
        name: createDto.name,
        description: createDto.description,
        typeId: createDto.typeId,
        level: createDto.level,
        impact: createDto.impact,
        triggerConditions: createDto.triggerConditions,
        dispositionMeasures: createDto.dispositionMeasures,
        createdBy,
      },
    });
  }

  async updateRisk(id: string, updateDto: any) {
    const risk = await this.prisma.risk.findUnique({ where: { id } });
    if (!risk) throw new NotFoundException(`Risk with ID ${id} not found`);
    return this.prisma.risk.update({ where: { id }, data: updateDto });
  }

  async removeRisk(id: string) {
    const risk = await this.prisma.risk.findUnique({ where: { id } });
    if (!risk) throw new NotFoundException(`Risk with ID ${id} not found`);
    await this.prisma.risk.delete({ where: { id } });
  }

  async getStats() {
    const [total, byLevel, byType] = await Promise.all([
      this.prisma.risk.count(),
      this.prisma.risk.groupBy({ by: ['level'], _count: true }),
      this.prisma.risk.groupBy({ by: ['typeId'], _count: true }),
    ]);
    return { total, byLevel: byLevel.map(l => ({ level: l.level, count: l._count })), typeCount: byType.length };
  }
}
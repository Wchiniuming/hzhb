import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PartnersService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page: number;
    pageSize: number;
    search?: string;
    status?: string;
  }) {
    const { page, pageSize, search, status } = params;
    const skip = (page - 1) * pageSize;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [partners, total] = await Promise.all([
      this.prisma.partner.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.partner.count({ where }),
    ]);

    const partnerIds = partners.map(p => p.id);
    const developerCounts = await this.prisma.developer.groupBy({
      by: ['partnerId'],
      where: { partnerId: { in: partnerIds } },
      _count: true,
    });
    const countMap = new Map(developerCounts.map(d => [d.partnerId, d._count]));

    return {
      data: partners.map(p => ({
        ...p,
        developerCount: countMap.get(p.id) || 0,
      })),
      meta: { page, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async findAllSimple() {
    return this.prisma.partner.findMany({
      where: { status: 'ACTIVE' },
      orderBy: { name: 'asc' },
      select: {
        id: true,
        name: true,
        status: true,
      },
    });
  }

  async findOne(id: string) {
    const partner = await this.prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      throw new NotFoundException(`合作伙伴不存在: ${id}`);
    }

    const devCount = await this.prisma.developer.count({ where: { partnerId: id } });
    return { ...partner, developerCount: devCount };
  }

  async getDetails(id: string) {
    const partner = await this.prisma.partner.findUnique({
      where: { id },
    });

    if (!partner) {
      throw new NotFoundException(`合作伙伴不存在: ${id}`);
    }

    const developers = await this.prisma.developer.findMany({
      where: { partnerId: id },
      include: {
        skills: {
          include: { skillTag: true }
        }
      },
    });

    return { ...partner, developer: developers };
  }

  async create(createPartnerDto: {
    name: string;
    contactInfo?: any;
    status?: string;
  }) {
    const existingPartner = await this.prisma.partner.findUnique({
      where: { name: createPartnerDto.name },
    });

    if (existingPartner) {
      throw new ConflictException('合作伙伴名称已存在');
    }

    const contactInfo = typeof createPartnerDto.contactInfo === 'object'
      ? JSON.stringify(createPartnerDto.contactInfo)
      : createPartnerDto.contactInfo;

    return this.prisma.partner.create({
      data: {
        name: createPartnerDto.name,
        contactInfo,
        status: createPartnerDto.status || 'ACTIVE',
      },
    });
  }

  async update(id: string, updatePartnerDto: {
    name?: string;
    contactInfo?: any;
    status?: string;
  }) {
    const existingPartner = await this.prisma.partner.findUnique({
      where: { id },
    });

    if (!existingPartner) {
      throw new NotFoundException(`合作伙伴不存在: ${id}`);
    }

    if (updatePartnerDto.name && updatePartnerDto.name !== existingPartner.name) {
      const partnerWithSameName = await this.prisma.partner.findUnique({
        where: { name: updatePartnerDto.name },
      });

      if (partnerWithSameName) {
        throw new ConflictException('合作伙伴名称已存在');
      }
    }

    const contactInfo = updatePartnerDto.contactInfo !== undefined
      ? (typeof updatePartnerDto.contactInfo === 'object'
        ? JSON.stringify(updatePartnerDto.contactInfo)
        : updatePartnerDto.contactInfo)
      : existingPartner.contactInfo;

    return this.prisma.partner.update({
      where: { id },
      data: {
        name: updatePartnerDto.name,
        contactInfo,
        status: updatePartnerDto.status,
      },
    });
  }

  async remove(id: string) {
    const existingPartner = await this.prisma.partner.findUnique({
      where: { id },
    });

    if (!existingPartner) {
      throw new NotFoundException(`合作伙伴不存在: ${id}`);
    }

    return this.prisma.partner.delete({ where: { id } });
  }

  async softDelete(id: string) {
    const existingPartner = await this.prisma.partner.findUnique({
      where: { id },
    });

    if (!existingPartner) {
      throw new NotFoundException(`合作伙伴不存在: ${id}`);
    }

    return this.prisma.partner.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.partner.update({
      where: { id },
      data: { status },
    });
  }

  async getStats() {
    const [total, byStatus, topPartners] = await Promise.all([
      this.prisma.partner.count({ where: { status: 'ACTIVE' } }),
      this.prisma.partner.groupBy({
        by: ['status'],
        _count: true,
      }),
      this.prisma.partner.findMany({
        where: { status: 'ACTIVE' },
        take: 5,
      }),
    ]);

    const partnerIds = topPartners.map(p => p.id);
    const devCounts = await this.prisma.developer.groupBy({
      by: ['partnerId'],
      where: { partnerId: { in: partnerIds } },
      _count: true,
    });
    const countMap = new Map(devCounts.map(d => [d.partnerId, d._count]));

    return {
      total,
      byStatus: byStatus.map(s => ({
        status: s.status,
        count: s._count,
      })),
      topPartners: topPartners.map(p => ({
        id: p.id,
        name: p.name,
        developerCount: countMap.get(p.id) || 0,
      })),
    };
  }
}

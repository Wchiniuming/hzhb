import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DevelopersService {
  constructor(private prisma: PrismaService) {}

  async findAll(params: {
    page: number;
    pageSize: number;
    search?: string;
    partnerId?: string;
    status?: string;
  }) {
    const { page, pageSize, search, partnerId, status } = params;
    const skip = (page - 1) * pageSize;

    const where: any = {};

    if (search) {
      where.OR = [
        { name: { contains: search } },
      ];
    }

    if (partnerId) {
      where.partnerId = partnerId;
    }

    if (status) {
      where.status = status;
    } else {
      where.status = { not: 'INACTIVE' };
    }

    const [developers, total] = await Promise.all([
      this.prisma.developer.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
        include: {
          skills: { include: { skillTag: true } },
        },
      }),
      this.prisma.developer.count({ where }),
    ]);

    return {
      data: developers,
      meta: { page, limit: pageSize, total, totalPages: Math.ceil(total / pageSize) },
    };
  }

  async getStats() {
    const [total, byStatus, byPartner, topSkills] = await Promise.all([
      this.prisma.developer.count(),
      this.prisma.developer.groupBy({
        by: ['status'],
        _count: true,
      }),
      this.prisma.developer.groupBy({
        by: ['partnerId'],
        _count: true,
      }),
      this.prisma.developerSkill.groupBy({
        by: ['skillTagId'],
        _count: true,
        orderBy: { _count: { skillTagId: 'desc' } },
        take: 10,
      }),
    ]);

    const partners = await this.prisma.partner.findMany({
      where: { id: { in: byPartner.map(p => p.partnerId) } },
      select: { id: true, name: true },
    });

    const skillTags = await this.prisma.skillTag.findMany({
      where: { id: { in: topSkills.map(s => s.skillTagId) } },
      select: { id: true, name: true },
    });

    return {
      total,
      byStatus: byStatus.map(s => ({ status: s.status, count: s._count })),
      byPartner: byPartner.map(p => ({
        partnerId: p.partnerId,
        partnerName: partners.find(part => part.id === p.partnerId)?.name || '',
        count: p._count,
      })),
      topSkills: topSkills.map(s => ({
        skillId: s.skillTagId,
        skillName: skillTags.find(tag => tag.id === s.skillTagId)?.name || '',
        count: s._count,
      })),
    };
  }

  async getAllSkills() {
    const skills = await this.prisma.skillTag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { developers: true } },
      },
    });

    return skills.map(s => ({
      ...s,
      developerCount: (s as any)._count?.developers || 0,
    }));
  }

  async findOne(id: string) {
    const developer = await this.prisma.developer.findUnique({
      where: { id },
      include: {
        skills: { include: { skillTag: true } },
      },
    });
    if (!developer) throw new NotFoundException(`开发人员不存在: ${id}`);
    return developer;
  }

  async getDetails(id: string) {
    const developer = await this.prisma.developer.findUnique({
      where: { id },
      include: {
        skills: { include: { skillTag: true } },
        experiences: { orderBy: { startDate: 'desc' } },
        certificates: true,
        approvals: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!developer) throw new NotFoundException(`开发人员不存在: ${id}`);
    return developer;
  }

  async create(createDto: {
    name: string;
    partnerId: string;
    gender?: string;
    age?: number;
    contact?: any;
    status?: string;
    skillIds?: string[];
  }) {
    const contact = typeof createDto.contact === 'object'
      ? JSON.stringify(createDto.contact)
      : createDto.contact;

    const developer = await this.prisma.developer.create({
      data: {
        name: createDto.name,
        partnerId: createDto.partnerId,
        gender: createDto.gender,
        age: createDto.age,
        contact,
        status: createDto.status || 'PENDING',
        skills: createDto.skillIds ? {
          create: createDto.skillIds.map(skillId => ({
            skillTagId: skillId,
          })),
        } : undefined,
      },
      include: {
        skills: { include: { skillTag: true } },
      },
    });

    return developer;
  }

  async update(id: string, updateDto: {
    name?: string;
    gender?: string;
    age?: number;
    contact?: any;
    status?: string;
  }) {
    const existing = await this.prisma.developer.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`开发人员不存在: ${id}`);

    const contact = updateDto.contact !== undefined
      ? (typeof updateDto.contact === 'object' ? JSON.stringify(updateDto.contact) : updateDto.contact)
      : existing.contact;

    return this.prisma.developer.update({
      where: { id },
      data: {
        name: updateDto.name,
        gender: updateDto.gender,
        age: updateDto.age,
        contact,
        status: updateDto.status,
      },
      include: {
        skills: { include: { skillTag: true } },
      },
    });
  }

  async remove(id: string) {
    const existing = await this.prisma.developer.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`开发人员不存在: ${id}`);

    return this.prisma.developer.delete({ where: { id } });
  }

  async softDelete(id: string) {
    const existing = await this.prisma.developer.findUnique({ where: { id } });
    if (!existing) throw new NotFoundException(`开发人员不存在: ${id}`);

    return this.prisma.developer.update({
      where: { id },
      data: { status: 'INACTIVE' },
    });
  }

  async updateStatus(id: string, status: string) {
    return this.prisma.developer.update({
      where: { id },
      data: { status },
    });
  }

  async addSkills(developerId: string, skillIds: string[], proficiency?: string) {
    const developer = await this.prisma.developer.findUnique({ where: { id: developerId } });
    if (!developer) throw new NotFoundException(`开发人员不存在: ${developerId}`);

    const skills = await Promise.all(
      skillIds.map(async skillTagId => {
        const existing = await this.prisma.developerSkill.findUnique({
          where: { developerId_skillTagId: { developerId, skillTagId } },
        });
        if (existing) return existing;

        return this.prisma.developerSkill.create({
          data: { developerId, skillTagId, proficiency: proficiency || 'INTERMEDIATE' },
          include: { skillTag: true },
        });
      })
    );

    return skills;
  }

  async removeSkill(developerId: string, skillTagId: string) {
    await this.prisma.developerSkill.delete({
      where: { developerId_skillTagId: { developerId, skillTagId } },
    });
  }

  async addExperience(developerId: string, dto: {
    projectName: string;
    role?: string;
    startDate: Date;
    endDate?: Date;
    description?: string;
  }) {
    const developer = await this.prisma.developer.findUnique({ where: { id: developerId } });
    if (!developer) throw new NotFoundException(`开发人员不存在: ${developerId}`);

    return this.prisma.developerExperience.create({
      data: {
        developerId,
        projectName: dto.projectName,
        role: dto.role,
        startDate: new Date(dto.startDate),
        endDate: dto.endDate ? new Date(dto.endDate) : null,
        description: dto.description,
      },
    });
  }

  async updateExperience(developerId: string, expId: string, dto: {
    projectName?: string;
    role?: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
  }) {
    const experience = await this.prisma.developerExperience.findUnique({
      where: { id: expId },
    });
    if (!experience || experience.developerId !== developerId) {
      throw new NotFoundException('项目经验不存在');
    }

    return this.prisma.developerExperience.update({
      where: { id: expId },
      data: {
        projectName: dto.projectName,
        role: dto.role,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        description: dto.description,
      },
    });
  }

  async removeExperience(developerId: string, expId: string) {
    const experience = await this.prisma.developerExperience.findUnique({
      where: { id: expId },
    });
    if (!experience || experience.developerId !== developerId) {
      throw new NotFoundException('项目经验不存在');
    }

    await this.prisma.developerExperience.delete({ where: { id: expId } });
  }

  async addCertificate(developerId: string, dto: {
    name: string;
    issuingBody?: string;
    issueDate: Date;
    expireDate?: Date;
    attachmentId?: string;
  }) {
    const developer = await this.prisma.developer.findUnique({ where: { id: developerId } });
    if (!developer) throw new NotFoundException(`开发人员不存在: ${developerId}`);

    return this.prisma.certificate.create({
      data: {
        developerId,
        name: dto.name,
        issuingBody: dto.issuingBody,
        issueDate: new Date(dto.issueDate),
        expireDate: dto.expireDate ? new Date(dto.expireDate) : null,
        attachmentId: dto.attachmentId,
      },
    });
  }

  async removeCertificate(developerId: string, certId: string) {
    const certificate = await this.prisma.certificate.findUnique({
      where: { id: certId },
    });
    if (!certificate || certificate.developerId !== developerId) {
      throw new NotFoundException('证书不存在');
    }

    await this.prisma.certificate.delete({ where: { id: certId } });
  }

  async approve(developerId: string, status: string, comments?: string) {
    const developer = await this.prisma.developer.findUnique({ where: { id: developerId } });
    if (!developer) throw new NotFoundException(`开发人员不存在: ${developerId}`);

    await this.prisma.developer.update({
      where: { id: developerId },
      data: { status },
    });

    await this.prisma.developerApproval.create({
      data: {
        developerId,
        status,
        comments,
      },
    });

    return { success: true, message: '审批成功' };
  }
}

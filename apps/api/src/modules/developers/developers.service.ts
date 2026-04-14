import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDeveloperDto, UpdateDeveloperDto, AddSkillDto, UpdateSkillDto, AddExperienceDto, AddCertificateDto } from './dto';

@Injectable()
export class DevelopersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, limit: number, partnerId?: string, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (partnerId) where.partnerId = partnerId;
    if (status) where.status = status;

    const [developers, total] = await Promise.all([
      this.prisma.developer.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { skills: { include: { skillTag: true } } },
      }),
      this.prisma.developer.count({ where }),
    ]);

    return { data: developers, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const developer = await this.prisma.developer.findUnique({
      where: { id },
      include: {
        skills: { include: { skillTag: true } },
        experiences: { orderBy: { startDate: 'desc' } },
        certificates: true,
        approvals: { orderBy: { createdAt: 'desc' } },
      },
    });
    if (!developer) throw new NotFoundException(`Developer with ID ${id} not found`);
    return developer;
  }

  async create(createDeveloperDto: CreateDeveloperDto) {
    return this.prisma.developer.create({
      data: {
        partnerId: createDeveloperDto.partnerId,
        name: createDeveloperDto.name,
        gender: createDeveloperDto.gender,
        age: createDeveloperDto.age,
        contact: createDeveloperDto.contact ? JSON.stringify(createDeveloperDto.contact) : null,
        status: 'PENDING',
      },
    });
  }

  async update(id: string, updateDeveloperDto: UpdateDeveloperDto) {
    const developer = await this.prisma.developer.findUnique({ where: { id } });
    if (!developer) throw new NotFoundException(`Developer with ID ${id} not found`);
    return this.prisma.developer.update({ where: { id }, data: updateDeveloperDto });
  }

  async remove(id: string) {
    const developer = await this.prisma.developer.findUnique({ where: { id } });
    if (!developer) throw new NotFoundException(`Developer with ID ${id} not found`);
    return this.prisma.developer.update({ where: { id }, data: { status: 'INACTIVE' } });
  }

  async addSkill(developerId: string, addSkillDto: AddSkillDto) {
    const developer = await this.prisma.developer.findUnique({ where: { id: developerId } });
    if (!developer) throw new NotFoundException(`Developer with ID ${developerId} not found`);

    const skillTag = await this.prisma.skillTag.findUnique({ where: { id: addSkillDto.skillTagId } });
    if (!skillTag) throw new NotFoundException(`SkillTag with ID ${addSkillDto.skillTagId} not found`);

    const existing = await this.prisma.developerSkill.findUnique({
      where: { developerId_skillTagId: { developerId, skillTagId: addSkillDto.skillTagId } },
    });
    if (existing) throw new ConflictException('Skill already exists for this developer');

    return this.prisma.developerSkill.create({
      data: { developerId, skillTagId: addSkillDto.skillTagId, proficiency: addSkillDto.proficiency },
      include: { skillTag: true },
    });
  }

  async updateSkill(developerId: string, skillTagId: string, updateSkillDto: UpdateSkillDto) {
    const skill = await this.prisma.developerSkill.findUnique({
      where: { developerId_skillTagId: { developerId, skillTagId } },
    });
    if (!skill) throw new NotFoundException('Skill not found for this developer');
    return this.prisma.developerSkill.update({
      where: { developerId_skillTagId: { developerId, skillTagId } },
      data: { proficiency: updateSkillDto.proficiency },
      include: { skillTag: true },
    });
  }

  async removeSkill(developerId: string, skillTagId: string) {
    const skill = await this.prisma.developerSkill.findUnique({
      where: { developerId_skillTagId: { developerId, skillTagId } },
    });
    if (!skill) throw new NotFoundException('Skill not found for this developer');
    await this.prisma.developerSkill.delete({ where: { developerId_skillTagId: { developerId, skillTagId } } });
  }

  async addExperience(developerId: string, addExperienceDto: AddExperienceDto) {
    const developer = await this.prisma.developer.findUnique({ where: { id: developerId } });
    if (!developer) throw new NotFoundException(`Developer with ID ${developerId} not found`);
    return this.prisma.developerExperience.create({
      data: {
        developerId,
        projectName: addExperienceDto.projectName,
        role: addExperienceDto.role,
        startDate: new Date(addExperienceDto.startDate),
        endDate: addExperienceDto.endDate ? new Date(addExperienceDto.endDate) : null,
        description: addExperienceDto.description,
      },
    });
  }

  async updateExperience(developerId: string, experienceId: string, updateDto: AddExperienceDto) {
    const experience = await this.prisma.developerExperience.findUnique({ where: { id: experienceId } });
    if (!experience || experience.developerId !== developerId) throw new NotFoundException('Experience not found');
    return this.prisma.developerExperience.update({
      where: { id: experienceId },
      data: {
        projectName: updateDto.projectName,
        role: updateDto.role,
        startDate: new Date(updateDto.startDate),
        endDate: updateDto.endDate ? new Date(updateDto.endDate) : undefined,
        description: updateDto.description,
      },
    });
  }

  async removeExperience(developerId: string, experienceId: string) {
    const experience = await this.prisma.developerExperience.findUnique({ where: { id: experienceId } });
    if (!experience || experience.developerId !== developerId) throw new NotFoundException('Experience not found');
    await this.prisma.developerExperience.delete({ where: { id: experienceId } });
  }

  async addCertificate(developerId: string, addCertificateDto: AddCertificateDto) {
    const developer = await this.prisma.developer.findUnique({ where: { id: developerId } });
    if (!developer) throw new NotFoundException(`Developer with ID ${developerId} not found`);
    return this.prisma.certificate.create({
      data: {
        developerId,
        name: addCertificateDto.name,
        issuingBody: addCertificateDto.issuingBody,
        issueDate: new Date(addCertificateDto.issueDate),
        expireDate: addCertificateDto.expireDate ? new Date(addCertificateDto.expireDate) : null,
        attachmentId: addCertificateDto.attachmentId,
      },
    });
  }

  async removeCertificate(developerId: string, certificateId: string) {
    const certificate = await this.prisma.certificate.findUnique({ where: { id: certificateId } });
    if (!certificate || certificate.developerId !== developerId) throw new NotFoundException('Certificate not found');
    await this.prisma.certificate.delete({ where: { id: certificateId } });
  }

  async submitForApproval(developerId: string, submittedBy: string) {
    const developer = await this.prisma.developer.findUnique({ where: { id: developerId } });
    if (!developer) throw new NotFoundException(`Developer with ID ${developerId} not found`);
    return this.prisma.developerApproval.create({
      data: { developerId, status: 'SUBMITTED', submittedBy },
    });
  }

  async approve(approvalId: string, approvedBy: string, comments?: string) {
    const approval = await this.prisma.developerApproval.findUnique({ where: { id: approvalId } });
    if (!approval) throw new NotFoundException(`Approval with ID ${approvalId} not found`);
    const updated = await this.prisma.developerApproval.update({
      where: { id: approvalId },
      data: { status: 'APPROVED', approvedBy, approvedAt: new Date(), comments },
    });
    if (updated.status === 'APPROVED') {
      await this.prisma.developer.update({ where: { id: updated.developerId }, data: { status: 'APPROVED' } });
    }
    return updated;
  }

  async reject(approvalId: string, approvedBy: string, comments: string) {
    const approval = await this.prisma.developerApproval.findUnique({ where: { id: approvalId } });
    if (!approval) throw new NotFoundException(`Approval with ID ${approvalId} not found`);
    return this.prisma.developerApproval.update({
      where: { id: approvalId },
      data: { status: 'REJECTED', approvedBy, approvedAt: new Date(), comments },
    });
  }

  async getApprovals(developerId: string) {
    return this.prisma.developerApproval.findMany({ where: { developerId }, orderBy: { createdAt: 'desc' } });
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRequirementDto, UpdateRequirementDto, CreatePlanDto, UpdatePlanDto, UpdateProgressDto, AcceptPlanDto } from './dto';

@Injectable()
export class ImprovementsService {
  constructor(private prisma: PrismaService) {}

  async findAllRequirements(page: number, limit: number, status?: string) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};
    const [requirements, total] = await Promise.all([
      this.prisma.improvementRequirement.findMany({ where, skip, take: limit }),
      this.prisma.improvementRequirement.count({ where }),
    ]);
    return { data: requirements, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOneRequirement(id: string) {
    const requirement = await this.prisma.improvementRequirement.findUnique({
      where: { id },
      include: { plan: { include: { progresses: true, acceptance: true } } },
    });
    if (!requirement) throw new NotFoundException(`Requirement with ID ${id} not found`);
    return requirement;
  }

  async createRequirement(createDto: CreateRequirementDto, createdBy: string) {
    return this.prisma.improvementRequirement.create({
      data: {
        originType: createDto.originType,
        originEntityId: createDto.originEntityId,
        title: createDto.title,
        description: createDto.description,
        targetDate: new Date(createDto.targetDate),
        responsibleType: createDto.responsibleType,
        responsibleId: createDto.responsibleId,
        createdBy,
        status: 'IDENTIFIED',
      },
    });
  }

  async updateRequirement(id: string, updateDto: UpdateRequirementDto) {
    const requirement = await this.prisma.improvementRequirement.findUnique({ where: { id } });
    if (!requirement) throw new NotFoundException(`Requirement with ID ${id} not found`);
    const data: any = { ...updateDto };
    if (updateDto.targetDate) data.targetDate = new Date(updateDto.targetDate);
    return this.prisma.improvementRequirement.update({ where: { id }, data });
  }

  async removeRequirement(id: string) {
    const requirement = await this.prisma.improvementRequirement.findUnique({ where: { id } });
    if (!requirement) throw new NotFoundException(`Requirement with ID ${id} not found`);
    await this.prisma.improvementRequirement.update({ where: { id }, data: { status: 'ACCEPTED' } });
  }

  async createPlan(createDto: CreatePlanDto) {
    const requirement = await this.prisma.improvementRequirement.findUnique({ where: { id: createDto.requirementId } });
    if (!requirement) throw new NotFoundException(`Requirement with ID ${createDto.requirementId} not found`);
    return this.prisma.improvementPlan.create({
      data: {
        requirementId: createDto.requirementId,
        steps: createDto.steps ? JSON.stringify(createDto.steps) : null,
        timeline: createDto.timeline ? JSON.stringify(createDto.timeline) : null,
        responsibilities: createDto.responsibilities ? JSON.stringify(createDto.responsibilities) : null,
        status: 'PLANNING',
      },
    });
  }

  async findOnePlan(id: string) {
    const plan = await this.prisma.improvementPlan.findUnique({
      where: { id },
      include: { progresses: true, acceptance: true },
    });
    if (!plan) throw new NotFoundException(`Plan with ID ${id} not found`);
    return plan;
  }

  async updatePlan(id: string, updateDto: UpdatePlanDto) {
    const plan = await this.prisma.improvementPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException(`Plan with ID ${id} not found`);
    const data: any = {};
    if (updateDto.steps !== undefined) data.steps = JSON.stringify(updateDto.steps);
    if (updateDto.timeline !== undefined) data.timeline = JSON.stringify(updateDto.timeline);
    if (updateDto.responsibilities !== undefined) data.responsibilities = JSON.stringify(updateDto.responsibilities);
    if (updateDto.status !== undefined) data.status = updateDto.status;
    return this.prisma.improvementPlan.update({ where: { id }, data });
  }

  async updateProgress(planId: string, updateProgressDto: UpdateProgressDto) {
    const plan = await this.prisma.improvementPlan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException(`Plan with ID ${planId} not found`);
    return this.prisma.improvementProgress.create({
      data: { planId, responsibleId: updateProgressDto.responsibleId, details: updateProgressDto.details },
    });
  }

  async acceptPlan(planId: string, acceptorId: string, acceptDto: AcceptPlanDto) {
    const plan = await this.prisma.improvementPlan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException(`Plan with ID ${planId} not found`);

    const acceptance = await this.prisma.improvementAcceptance.create({
      data: { planId, result: acceptDto.result === 'true', comments: acceptDto.comments, acceptorId },
    });

    if (acceptDto.result === 'true') {
      await this.prisma.improvementPlan.update({ where: { id: planId }, data: { status: 'ACCEPTED' } });
      const requirement = await this.prisma.improvementRequirement.findFirst({ where: { improvementPlanId: planId } });
      if (requirement) {
        await this.prisma.improvementRequirement.update({ where: { id: requirement.id }, data: { status: 'ACCEPTED' } });
      }
    }
    return acceptance;
  }

  async submitForApproval(planId: string, submittedBy: string) {
    const plan = await this.prisma.improvementPlan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException(`Plan with ID ${planId} not found`);
    return this.prisma.improvementApproval.create({ data: { planId, status: 'SUBMITTED', submittedBy } });
  }

  async approve(approvalId: string, approvedBy: string, comments?: string) {
    const approval = await this.prisma.improvementApproval.findUnique({ where: { id: approvalId } });
    if (!approval) throw new NotFoundException(`Approval with ID ${approvalId} not found`);
    const updated = await this.prisma.improvementApproval.update({
      where: { id: approvalId },
      data: { status: 'APPROVED', approvedBy, approvedAt: new Date(), comments },
    });
    if (updated.status === 'APPROVED') {
      await this.prisma.improvementPlan.update({ where: { id: updated.planId }, data: { status: 'IN_PROGRESS' } });
    }
    return updated;
  }

  async reject(approvalId: string, approvedBy: string, comments: string) {
    const approval = await this.prisma.improvementApproval.findUnique({ where: { id: approvalId } });
    if (!approval) throw new NotFoundException(`Approval with ID ${approvalId} not found`);
    return this.prisma.improvementApproval.update({
      where: { id: approvalId },
      data: { status: 'REJECTED', approvedBy, approvedAt: new Date(), comments },
    });
  }

  async getProgress(planId: string) {
    return this.prisma.improvementProgress.findMany({ where: { planId } });
  }

  async getApprovals(planId: string) {
    return this.prisma.improvementApproval.findMany({ where: { planId } });
  }

  async getAcceptance(planId: string) {
    return this.prisma.improvementAcceptance.findUnique({ where: { planId } });
  }

  async getStats() {
    const [total, byStatus, inProgress, completed] = await Promise.all([
      this.prisma.improvementRequirement.count(),
      this.prisma.improvementRequirement.groupBy({ by: ['status'], _count: true }),
      this.prisma.improvementPlan.count({ where: { status: 'IN_PROGRESS' } }),
      this.prisma.improvementRequirement.count({ where: { status: 'ACCEPTED' } }),
    ]);
    return { total, byStatus: byStatus.map(s => ({ status: s.status, count: s._count })), inProgress, completed };
  }
}
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateIndicatorDto, UpdateIndicatorDto, CreatePlanDto, UpdatePlanDto, CreateAssessmentDto, ScoreIndicatorDto } from './dto';

@Injectable()
export class AssessmentsService {
  constructor(private prisma: PrismaService) {}

  async findAllIndicators(parentId?: string) {
    const where = parentId ? { parentId } : { parentId: null };
    return this.prisma.assessmentIndicator.findMany({ where });
  }

  async createIndicator(createDto: CreateIndicatorDto) {
    return this.prisma.assessmentIndicator.create({ data: createDto });
  }

  async updateIndicator(id: string, updateDto: UpdateIndicatorDto) {
    const indicator = await this.prisma.assessmentIndicator.findUnique({ where: { id } });
    if (!indicator) throw new NotFoundException(`Indicator with ID ${id} not found`);
    return this.prisma.assessmentIndicator.update({ where: { id }, data: updateDto });
  }

  async removeIndicator(id: string) {
    const indicator = await this.prisma.assessmentIndicator.findUnique({ where: { id } });
    if (!indicator) throw new NotFoundException(`Indicator with ID ${id} not found`);
    await this.prisma.assessmentIndicator.delete({ where: { id } });
  }

  async findAllPlans(page: number, limit: number, status?: string) {
    const skip = (page - 1) * limit;
    const where = status ? { status } : {};
    const [plans, total] = await Promise.all([
      this.prisma.assessmentPlan.findMany({ where, skip, take: limit }),
      this.prisma.assessmentPlan.count({ where }),
    ]);
    return { data: plans, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOnePlan(id: string) {
    const plan = await this.prisma.assessmentPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException(`Plan with ID ${id} not found`);
    return plan;
  }

  async createPlan(createDto: CreatePlanDto, createdBy: string) {
    return this.prisma.assessmentPlan.create({
      data: {
        name: createDto.name,
        targetPartners: createDto.targetPartners ? JSON.stringify(createDto.targetPartners) : null,
        cycle: createDto.cycle,
        assessors: createDto.assessors ? JSON.stringify(createDto.assessors) : null,
        startDate: new Date(createDto.startDate),
        endDate: new Date(createDto.endDate),
        method: createDto.method,
        createdBy,
        status: 'DRAFT',
      },
    });
  }

  async updatePlan(id: string, updateDto: UpdatePlanDto) {
    const plan = await this.prisma.assessmentPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException(`Plan with ID ${id} not found`);
    const data: any = { ...updateDto };
    if (updateDto.startDate) data.startDate = new Date(updateDto.startDate);
    if (updateDto.endDate) data.endDate = new Date(updateDto.endDate);
    return this.prisma.assessmentPlan.update({ where: { id }, data });
  }

  async removePlan(id: string) {
    const plan = await this.prisma.assessmentPlan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException(`Plan with ID ${id} not found`);
    await this.prisma.assessmentPlan.update({ where: { id }, data: { status: 'CANCELLED' } });
  }

  async findAllAssessments(page: number, limit: number, planId?: string, partnerId?: string, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (planId) where.planId = planId;
    if (partnerId) where.partnerId = partnerId;
    if (status) where.status = status;

    const [assessments, total] = await Promise.all([
      this.prisma.assessment.findMany({ where, skip, take: limit }),
      this.prisma.assessment.count({ where }),
    ]);
    return { data: assessments, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOneAssessment(id: string) {
    const assessment = await this.prisma.assessment.findUnique({ where: { id } });
    if (!assessment) throw new NotFoundException(`Assessment with ID ${id} not found`);
    return assessment;
  }

  async createAssessment(createDto: CreateAssessmentDto) {
    const [plan, partner] = await Promise.all([
      this.prisma.assessmentPlan.findUnique({ where: { id: createDto.planId } }),
      this.prisma.partner.findUnique({ where: { id: createDto.partnerId } }),
    ]);
    if (!plan) throw new NotFoundException(`Plan with ID ${createDto.planId} not found`);
    if (!partner) throw new NotFoundException(`Partner with ID ${createDto.partnerId} not found`);

    return this.prisma.assessment.create({
      data: { planId: createDto.planId, partnerId: createDto.partnerId, startDate: new Date(createDto.startDate), status: 'NOT_STARTED' },
    });
  }

  async scoreIndicator(assessmentId: string, scoreDto: ScoreIndicatorDto) {
    const assessment = await this.prisma.assessment.findUnique({ where: { id: assessmentId } });
    if (!assessment) throw new NotFoundException(`Assessment with ID ${assessmentId} not found`);

    const indicator = await this.prisma.assessmentIndicator.findUnique({ where: { id: scoreDto.indicatorId } });
    if (!indicator) throw new NotFoundException(`Indicator with ID ${scoreDto.indicatorId} not found`);

    const finalScore = scoreDto.manualScore ?? scoreDto.autoScore ?? 0;

    return this.prisma.assessmentScore.create({
      data: {
        assessmentId, indicatorId: scoreDto.indicatorId,
        autoScore: scoreDto.autoScore, manualScore: scoreDto.manualScore,
        finalScore, comments: scoreDto.comments,
      },
    });
  }

  async completeAssessment(assessmentId: string) {
    const assessment = await this.prisma.assessment.findUnique({
      where: { id: assessmentId },
      include: { scores: true },
    });
    if (!assessment) throw new NotFoundException(`Assessment with ID ${assessmentId} not found`);

    const indicators = await this.prisma.assessmentIndicator.findMany();
    const indicatorMap = new Map(indicators.map(i => [i.id, i]));

    let totalScore = 0;
    let totalWeight = 0;
    for (const score of assessment.scores) {
      const indicator = indicatorMap.get(score.indicatorId);
      if (indicator && score.finalScore !== null) {
        totalScore += score.finalScore * indicator.weight;
        totalWeight += indicator.weight;
      }
    }

    const overallScore = totalWeight > 0 ? (totalScore / totalWeight) : 0;
    return this.prisma.assessment.update({
      where: { id: assessmentId },
      data: { status: 'COMPLETED', endDate: new Date(), overallScore },
    });
  }

  async generateReport(assessmentId: string) {
    const assessment = await this.prisma.assessment.findUnique({ where: { id: assessmentId } });
    if (!assessment) throw new NotFoundException(`Assessment with ID ${assessmentId} not found`);

    const content = {
      overallScore: assessment.overallScore,
      generatedAt: new Date(),
    };

    return this.prisma.assessmentReport.create({
      data: { assessmentId, content: JSON.stringify(content) },
    });
  }

  async submitPlanApproval(planId: string, submittedBy: string) {
    const plan = await this.prisma.assessmentPlan.findUnique({ where: { id: planId } });
    if (!plan) throw new NotFoundException(`Plan with ID ${planId} not found`);
    return this.prisma.assessmentApproval.create({ data: { planId, status: 'SUBMITTED', submittedBy } });
  }

  async approvePlan(approvalId: string, approvedBy: string, comments?: string) {
    const approval = await this.prisma.assessmentApproval.findUnique({ where: { id: approvalId } });
    if (!approval) throw new NotFoundException(`Approval with ID ${approvalId} not found`);
    const updated = await this.prisma.assessmentApproval.update({
      where: { id: approvalId },
      data: { status: 'APPROVED', approvedBy, approvedAt: new Date(), comments },
    });
    if (updated.status === 'APPROVED') {
      await this.prisma.assessmentPlan.update({ where: { id: updated.planId }, data: { status: 'ACTIVE' } });
    }
    return updated;
  }

  async rejectPlan(approvalId: string, approvedBy: string, comments: string) {
    const approval = await this.prisma.assessmentApproval.findUnique({ where: { id: approvalId } });
    if (!approval) throw new NotFoundException(`Approval with ID ${approvalId} not found`);
    return this.prisma.assessmentApproval.update({
      where: { id: approvalId },
      data: { status: 'REJECTED', approvedBy, approvedAt: new Date(), comments },
    });
  }

  async getStats() {
    const [totalPlans, activePlans, totalAssessments, completedAssessments, avgScore] = await Promise.all([
      this.prisma.assessmentPlan.count(),
      this.prisma.assessmentPlan.count({ where: { status: { in: ['PUBLISHED', 'IN_PROGRESS'] } } }),
      this.prisma.assessment.count(),
      this.prisma.assessment.count({ where: { status: 'COMPLETED' } }),
      this.prisma.assessment.aggregate({ where: { overallScore: { not: null } }, _avg: { overallScore: true } }),
    ]);
    return { totalPlans, activePlans, totalAssessments, completedAssessments, avgScore: avgScore._avg.overallScore || 0 };
  }
}
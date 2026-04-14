import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTaskDto, UpdateTaskDto, AssignDeveloperDto, UpdateAssignmentDto, UpdateProgressDto, CreateDelayRequestDto, SubmitDeliverableDto, AcceptDeliverableDto } from './dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, limit: number, partnerId?: string, status?: string) {
    const skip = (page - 1) * limit;
    const where: any = {};
    if (partnerId) where.partnerId = partnerId;
    if (status) where.status = status;

    const [tasks, total] = await Promise.all([
      this.prisma.task.findMany({
        where, skip, take: limit, orderBy: { createdAt: 'desc' },
        include: { assignments: true },
      }),
      this.prisma.task.count({ where }),
    ]);

    return { data: tasks, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: {
        assignments: true,
        progresses: { orderBy: { updateTime: 'desc' } },
        delayRequests: true,
        deliverables: true,
        acceptances: true,
        approvals: true,
      },
    });
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
    return task;
  }

  async create(createTaskDto: CreateTaskDto, createdBy: string) {
    const { assigneeIds, ...taskData } = createTaskDto;
    return this.prisma.task.create({
      data: {
        ...taskData,
        startDate: new Date(taskData.startDate),
        endDate: new Date(taskData.endDate),
        createdBy,
        assignments: assigneeIds ? { create: assigneeIds.map(developerId => ({ developerId })) } : undefined,
      },
      include: { assignments: true },
    });
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
    const data: any = { ...updateTaskDto };
    if (updateTaskDto.startDate) data.startDate = new Date(updateTaskDto.startDate);
    if (updateTaskDto.endDate) data.endDate = new Date(updateTaskDto.endDate);
    return this.prisma.task.update({ where: { id }, data, include: { assignments: true } });
  }

  async remove(id: string) {
    const task = await this.prisma.task.findUnique({ where: { id } });
    if (!task) throw new NotFoundException(`Task with ID ${id} not found`);
    return this.prisma.task.update({ where: { id }, data: { status: 'CANCELLED' } });
  }

  async assignDeveloper(taskId: string, assignDto: AssignDeveloperDto) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException(`Task with ID ${taskId} not found`);

    const existing = await this.prisma.taskAssignment.findUnique({
      where: { taskId_developerId: { taskId, developerId: assignDto.developerId } },
    });
    if (existing) throw new BadRequestException('Developer already assigned to this task');

    return this.prisma.taskAssignment.create({
      data: {
        taskId, developerId: assignDto.developerId, role: assignDto.role,
        responsibilities: assignDto.responsibilities,
        deliveryNode: assignDto.deliveryNode ? new Date(assignDto.deliveryNode) : null,
      },
    });
  }

  async updateAssignment(taskId: string, developerId: string, updateDto: UpdateAssignmentDto) {
    const assignment = await this.prisma.taskAssignment.findUnique({
      where: { taskId_developerId: { taskId, developerId } },
    });
    if (!assignment) throw new NotFoundException('Assignment not found');
    return this.prisma.taskAssignment.update({
      where: { taskId_developerId: { taskId, developerId } },
      data: { role: updateDto.role, responsibilities: updateDto.responsibilities },
    });
  }

  async removeAssignment(taskId: string, developerId: string) {
    const assignment = await this.prisma.taskAssignment.findUnique({
      where: { taskId_developerId: { taskId, developerId } },
    });
    if (!assignment) throw new NotFoundException('Assignment not found');
    await this.prisma.taskAssignment.delete({ where: { taskId_developerId: { taskId, developerId } } });
  }

  async updateProgress(taskId: string, developerId: string, updateProgressDto: UpdateProgressDto) {
    return this.prisma.taskProgress.create({
      data: { taskId, developerId, status: updateProgressDto.status, details: updateProgressDto.details },
    });
  }

  async createDelayRequest(taskId: string, createDelayRequestDto: CreateDelayRequestDto) {
    const task = await this.prisma.task.findUnique({ where: { id: taskId } });
    if (!task) throw new NotFoundException(`Task with ID ${taskId} not found`);
    return this.prisma.taskDelayRequest.create({
      data: { taskId, reason: createDelayRequestDto.reason, newEndDate: new Date(createDelayRequestDto.newEndDate) },
    });
  }

  async approveDelayRequest(delayRequestId: string, approverId: string, comments?: string) {
    const request = await this.prisma.taskDelayRequest.findUnique({ where: { id: delayRequestId } });
    if (!request) throw new NotFoundException(`Delay request with ID ${delayRequestId} not found`);
    const updated = await this.prisma.taskDelayRequest.update({
      where: { id: delayRequestId },
      data: { status: 'APPROVED', approverId, approvalTime: new Date(), comments },
    });
    if (updated.status === 'APPROVED') {
      await this.prisma.task.update({ where: { id: updated.taskId }, data: { endDate: updated.newEndDate } });
    }
    return updated;
  }

  async rejectDelayRequest(delayRequestId: string, approverId: string, comments: string) {
    const request = await this.prisma.taskDelayRequest.findUnique({ where: { id: delayRequestId } });
    if (!request) throw new NotFoundException(`Delay request with ID ${delayRequestId} not found`);
    return this.prisma.taskDelayRequest.update({
      where: { id: delayRequestId },
      data: { status: 'REJECTED', approverId, approvalTime: new Date(), comments },
    });
  }

  async submitDeliverable(taskId: string, developerId: string, submitDto: SubmitDeliverableDto) {
    return this.prisma.taskDeliverable.create({
      data: { 
        taskId, 
        developerId, 
        description: submitDto.description, 
        attachmentIds: submitDto.attachmentIds ? JSON.stringify(submitDto.attachmentIds) : null 
      },
    });
  }

  async acceptDeliverable(taskId: string, deliverableId: string, acceptorId: string, acceptDto: AcceptDeliverableDto) {
    const deliverable = await this.prisma.taskDeliverable.findUnique({ where: { id: deliverableId } });
    if (!deliverable || deliverable.taskId !== taskId) throw new NotFoundException('Deliverable not found');

    const result = await this.prisma.taskAcceptance.create({
      data: { taskId, deliverableId, acceptorId, result: acceptDto.result === 'true', comments: acceptDto.comments },
    });

    if (acceptDto.result === 'true') {
      await this.prisma.task.update({ where: { id: taskId }, data: { status: 'ACCEPTED' } });
    }
    return result;
  }

  async submitForApproval(taskId: string, submittedBy: string) {
    return this.prisma.taskApproval.create({ data: { taskId, status: 'SUBMITTED', submittedBy } });
  }

  async approve(approvalId: string, approvedBy: string, comments?: string) {
    const approval = await this.prisma.taskApproval.findUnique({ where: { id: approvalId } });
    if (!approval) throw new NotFoundException(`Approval with ID ${approvalId} not found`);
    return this.prisma.taskApproval.update({
      where: { id: approvalId },
      data: { status: 'APPROVED', approvedBy, approvedAt: new Date(), comments },
    });
  }

  async reject(approvalId: string, approvedBy: string, comments: string) {
    const approval = await this.prisma.taskApproval.findUnique({ where: { id: approvalId } });
    if (!approval) throw new NotFoundException(`Approval with ID ${approvalId} not found`);
    return this.prisma.taskApproval.update({
      where: { id: approvalId },
      data: { status: 'REJECTED', approvedBy, approvedAt: new Date(), comments },
    });
  }

  async getApprovals(taskId: string) {
    return this.prisma.taskApproval.findMany({ where: { taskId } });
  }

  async getProgress(taskId: string) {
    return this.prisma.taskProgress.findMany({ where: { taskId }, orderBy: { updateTime: 'desc' } });
  }

  async getDelayRequests(taskId: string) {
    return this.prisma.taskDelayRequest.findMany({ where: { taskId } });
  }

  async getDeliverables(taskId: string) {
    return this.prisma.taskDeliverable.findMany({ where: { taskId }, orderBy: { submissionTime: 'desc' } });
  }
}
import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  HttpCode, HttpStatus, ParseUUIDPipe, DefaultValuePipe, ParseIntPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto, AssignDeveloperDto, UpdateAssignmentDto, UpdateProgressDto, CreateDelayRequestDto, SubmitDeliverableDto, AcceptDeliverableDto } from './dto';
import { CurrentUser } from '../../auth/current-user.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('partnerId') partnerId?: string,
    @Query('status') status?: string,
  ) {
    return this.tasksService.findAll(page, limit, partnerId, status);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: any) {
    return this.tasksService.create(createTaskDto, user.id);
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.remove(id);
  }

  @Post(':id/assignments')
  @HttpCode(HttpStatus.CREATED)
  async assignDeveloper(@Param('id', ParseUUIDPipe) id: string, @Body() assignDto: AssignDeveloperDto) {
    return this.tasksService.assignDeveloper(id, assignDto);
  }

  @Put(':id/assignments/:developerId')
  async updateAssignment(@Param('id', ParseUUIDPipe) id: string, @Param('developerId', ParseUUIDPipe) developerId: string, @Body() updateDto: UpdateAssignmentDto) {
    return this.tasksService.updateAssignment(id, developerId, updateDto);
  }

  @Delete(':id/assignments/:developerId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAssignment(@Param('id', ParseUUIDPipe) id: string, @Param('developerId', ParseUUIDPipe) developerId: string) {
    return this.tasksService.removeAssignment(id, developerId);
  }

  @Post(':id/progress')
  @HttpCode(HttpStatus.CREATED)
  async updateProgress(@Param('id', ParseUUIDPipe) id: string, @Body() body: { developerId: string; data: UpdateProgressDto }) {
    return this.tasksService.updateProgress(id, body.developerId, body.data);
  }

  @Get(':id/progress')
  async getProgress(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.getProgress(id);
  }

  @Post(':id/delay-requests')
  @HttpCode(HttpStatus.CREATED)
  async createDelayRequest(@Param('id', ParseUUIDPipe) id: string, @Body() createDto: CreateDelayRequestDto) {
    return this.tasksService.createDelayRequest(id, createDto);
  }

  @Get(':id/delay-requests')
  async getDelayRequests(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.getDelayRequests(id);
  }

  @Post('delay-requests/:delayRequestId/approve')
  async approveDelayRequest(@Param('delayRequestId', ParseUUIDPipe) delayRequestId: string, @Body() body: { comments?: string }, @CurrentUser() user: any) {
    return this.tasksService.approveDelayRequest(delayRequestId, user.id, body.comments);
  }

  @Post('delay-requests/:delayRequestId/reject')
  async rejectDelayRequest(@Param('delayRequestId', ParseUUIDPipe) delayRequestId: string, @Body() body: { comments: string }, @CurrentUser() user: any) {
    return this.tasksService.rejectDelayRequest(delayRequestId, user.id, body.comments);
  }

  @Post(':id/deliverables')
  @HttpCode(HttpStatus.CREATED)
  async submitDeliverable(@Param('id', ParseUUIDPipe) id: string, @Body() body: { developerId: string; data: SubmitDeliverableDto }) {
    return this.tasksService.submitDeliverable(id, body.developerId, body.data);
  }

  @Get(':id/deliverables')
  async getDeliverables(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.getDeliverables(id);
  }

  @Post(':id/deliverables/:deliverableId/accept')
  async acceptDeliverable(@Param('id', ParseUUIDPipe) id: string, @Param('deliverableId', ParseUUIDPipe) deliverableId: string, @Body() acceptDto: AcceptDeliverableDto, @CurrentUser() user: any) {
    return this.tasksService.acceptDeliverable(id, deliverableId, user.id, acceptDto);
  }

  @Post(':id/submit')
  @HttpCode(HttpStatus.CREATED)
  async submitForApproval(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.tasksService.submitForApproval(id, user.id);
  }

  @Get(':id/approvals')
  async getApprovals(@Param('id', ParseUUIDPipe) id: string) {
    return this.tasksService.getApprovals(id);
  }

  @Post(':id/approvals/:approvalId/approve')
  async approve(@Param('id', ParseUUIDPipe) id: string, @Param('approvalId', ParseUUIDPipe) approvalId: string, @Body() body: { comments?: string }, @CurrentUser() user: any) {
    return this.tasksService.approve(approvalId, user.id, body.comments);
  }

  @Post(':id/approvals/:approvalId/reject')
  async reject(@Param('id', ParseUUIDPipe) id: string, @Param('approvalId', ParseUUIDPipe) approvalId: string, @Body() body: { comments: string }, @CurrentUser() user: any) {
    return this.tasksService.reject(approvalId, user.id, body.comments);
  }
}
import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  HttpCode, HttpStatus, Patch, ParseIntPipe, DefaultValuePipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto, UpdateTaskDto } from './dto';
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

  @Get('stats')
  async getStats() {
    return this.tasksService.getStats();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.tasksService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createTaskDto: CreateTaskDto, @CurrentUser() user: any) {
    return this.tasksService.create(createTaskDto, user?.id || 'system');
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(id, updateTaskDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.tasksService.remove(id);
  }

  @Post(':id/soft-delete')
  @HttpCode(HttpStatus.OK)
  async softDelete(@Param('id') id: string) {
    return this.tasksService.softDelete(id);
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() body: { status: string }) {
    return this.tasksService.update(id, { status: body.status } as UpdateTaskDto);
  }

  @Post(':id/assignments')
  @HttpCode(HttpStatus.CREATED)
  async addAssignment(@Param('id') id: string, @Body() body: { developerId: string; role?: string; responsibilities?: string }) {
    return this.tasksService.assignDeveloper(id, body);
  }

  @Delete(':id/assignments/:devId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeAssignment(@Param('id') id: string, @Param('devId') devId: string) {
    return this.tasksService.removeAssignment(id, devId);
  }

  @Post(':id/progress')
  @HttpCode(HttpStatus.CREATED)
  async addProgress(@Param('id') id: string, @Body() body: { developerId: string; status: string; details?: string }) {
    return this.tasksService.updateProgress(id, body.developerId, body);
  }

  @Get(':id/progress')
  async getProgress(@Param('id') id: string) {
    return this.tasksService.getProgress(id);
  }

  @Post(':id/delay')
  @HttpCode(HttpStatus.CREATED)
  async requestDelay(@Param('id') id: string, @Body() body: { reason: string; newEndDate: string }) {
    return this.tasksService.createDelayRequest(id, body);
  }

  @Post(':id/delay/:delayId/approve')
  @HttpCode(HttpStatus.OK)
  async approveDelay(@Param('delayId') delayId: string, @Body() body: { comments?: string }, @CurrentUser() user: any) {
    return this.tasksService.approveDelayRequest(delayId, user?.id || 'system', body.comments);
  }

  @Post(':id/delay/:delayId/reject')
  @HttpCode(HttpStatus.OK)
  async rejectDelay(@Param('delayId') delayId: string, @Body() body: { comments: string }, @CurrentUser() user: any) {
    return this.tasksService.rejectDelayRequest(delayId, user?.id || 'system', body.comments);
  }

  @Post(':id/deliverables')
  @HttpCode(HttpStatus.CREATED)
  async submitDeliverable(@Param('id') id: string, @Body() body: { developerId: string; description?: string; attachmentIds?: string[] }) {
    return this.tasksService.submitDeliverable(id, body.developerId, body);
  }

  @Get(':id/deliverables')
  async getDeliverables(@Param('id') id: string) {
    return this.tasksService.getDeliverables(id);
  }

  @Get(':id/delay-requests')
  async getDelayRequests(@Param('id') id: string) {
    return this.tasksService.getDelayRequests(id);
  }
}

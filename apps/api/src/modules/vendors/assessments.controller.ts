import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  HttpCode, HttpStatus, ParseUUIDPipe, DefaultValuePipe, ParseIntPipe,
} from '@nestjs/common';
import { AssessmentsService } from './assessments.service';
import { CreateIndicatorDto, UpdateIndicatorDto, CreatePlanDto, UpdatePlanDto, CreateAssessmentDto, ScoreIndicatorDto } from './dto';
import { CurrentUser } from '../../auth/current-user.decorator';

@Controller('assessment')
export class AssessmentsController {
  constructor(private readonly assessmentsService: AssessmentsService) {}

  @Get('indicators')
  async findAllIndicators(@Query('parentId') parentId?: string) {
    return this.assessmentsService.findAllIndicators(parentId);
  }

  @Post('indicators')
  @HttpCode(HttpStatus.CREATED)
  async createIndicator(@Body() createDto: CreateIndicatorDto) {
    return this.assessmentsService.createIndicator(createDto);
  }

  @Put('indicators/:id')
  async updateIndicator(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateIndicatorDto) {
    return this.assessmentsService.updateIndicator(id, updateDto);
  }

  @Delete('indicators/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeIndicator(@Param('id', ParseUUIDPipe) id: string) {
    return this.assessmentsService.removeIndicator(id);
  }

  @Get('plans')
  async findAllPlans(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: string,
  ) {
    return this.assessmentsService.findAllPlans(page, limit, status);
  }

  @Get('plans/:id')
  async findOnePlan(@Param('id', ParseUUIDPipe) id: string) {
    return this.assessmentsService.findOnePlan(id);
  }

  @Post('plans')
  @HttpCode(HttpStatus.CREATED)
  async createPlan(@Body() createDto: CreatePlanDto, @CurrentUser() user: any) {
    return this.assessmentsService.createPlan(createDto, user.id);
  }

  @Put('plans/:id')
  async updatePlan(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdatePlanDto) {
    return this.assessmentsService.updatePlan(id, updateDto);
  }

  @Delete('plans/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removePlan(@Param('id', ParseUUIDPipe) id: string) {
    return this.assessmentsService.removePlan(id);
  }

  @Post('plans/:id/submit')
  @HttpCode(HttpStatus.CREATED)
  async submitPlanApproval(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.assessmentsService.submitPlanApproval(id, user.id);
  }

  @Post('plans/approvals/:approvalId/approve')
  async approvePlan(@Param('approvalId', ParseUUIDPipe) approvalId: string, @Body() body: { comments?: string }, @CurrentUser() user: any) {
    return this.assessmentsService.approvePlan(approvalId, user.id, body.comments);
  }

  @Post('plans/approvals/:approvalId/reject')
  async rejectPlan(@Param('approvalId', ParseUUIDPipe) approvalId: string, @Body() body: { comments: string }, @CurrentUser() user: any) {
    return this.assessmentsService.rejectPlan(approvalId, user.id, body.comments);
  }

  @Get('assessments')
  async findAllAssessments(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('planId') planId?: string,
    @Query('partnerId') partnerId?: string,
    @Query('status') status?: string,
  ) {
    return this.assessmentsService.findAllAssessments(page, limit, planId, partnerId, status);
  }

  @Get('assessments/:id')
  async findOneAssessment(@Param('id', ParseUUIDPipe) id: string) {
    return this.assessmentsService.findOneAssessment(id);
  }

  @Post('assessments')
  @HttpCode(HttpStatus.CREATED)
  async createAssessment(@Body() createDto: CreateAssessmentDto) {
    return this.assessmentsService.createAssessment(createDto);
  }

  @Post('assessments/:id/score')
  @HttpCode(HttpStatus.CREATED)
  async scoreIndicator(@Param('id', ParseUUIDPipe) id: string, @Body() scoreDto: ScoreIndicatorDto) {
    return this.assessmentsService.scoreIndicator(id, scoreDto);
  }

  @Post('assessments/:id/complete')
  async completeAssessment(@Param('id', ParseUUIDPipe) id: string) {
    return this.assessmentsService.completeAssessment(id);
  }

  @Post('assessments/:id/report')
  async generateReport(@Param('id', ParseUUIDPipe) id: string) {
    return this.assessmentsService.generateReport(id);
  }
}
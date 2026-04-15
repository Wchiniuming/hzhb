import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  HttpCode, HttpStatus, ParseUUIDPipe, DefaultValuePipe, ParseIntPipe,
} from '@nestjs/common';
import { ImprovementsService } from './improvements.service';
import { CreateRequirementDto, UpdateRequirementDto, CreatePlanDto, UpdatePlanDto, UpdateProgressDto, AcceptPlanDto } from './dto';
import { CurrentUser } from '../../auth/current-user.decorator';

@Controller('improvements')
export class ImprovementsController {
  constructor(private readonly improvementsService: ImprovementsService) {}

  @Get('requirements')
  async findAllRequirements(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('status') status?: string,
  ) {
    return this.improvementsService.findAllRequirements(page, limit, status);
  }

  @Get('requirements/:id')
  async findOneRequirement(@Param('id', ParseUUIDPipe) id: string) {
    return this.improvementsService.findOneRequirement(id);
  }

  @Post('requirements')
  @HttpCode(HttpStatus.CREATED)
  async createRequirement(@Body() createDto: CreateRequirementDto, @CurrentUser() user: any) {
    return this.improvementsService.createRequirement(createDto, user.id);
  }

  @Put('requirements/:id')
  async updateRequirement(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdateRequirementDto) {
    return this.improvementsService.updateRequirement(id, updateDto);
  }

  @Delete('requirements/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeRequirement(@Param('id', ParseUUIDPipe) id: string) {
    return this.improvementsService.removeRequirement(id);
  }

  @Post('requirements/:id/soft-delete')
  @HttpCode(HttpStatus.OK)
  async softDeleteRequirement(@Param('id', ParseUUIDPipe) id: string) {
    return this.improvementsService.softDeleteRequirement(id);
  }

  @Post('plans')
  @HttpCode(HttpStatus.CREATED)
  async createPlan(@Body() createDto: CreatePlanDto) {
    return this.improvementsService.createPlan(createDto);
  }

  @Get('plans/:id')
  async findOnePlan(@Param('id', ParseUUIDPipe) id: string) {
    return this.improvementsService.findOnePlan(id);
  }

  @Put('plans/:id')
  async updatePlan(@Param('id', ParseUUIDPipe) id: string, @Body() updateDto: UpdatePlanDto) {
    return this.improvementsService.updatePlan(id, updateDto);
  }

  @Post('plans/:id/progress')
  @HttpCode(HttpStatus.CREATED)
  async updateProgress(@Param('id', ParseUUIDPipe) id: string, @Body() updateProgressDto: UpdateProgressDto) {
    return this.improvementsService.updateProgress(id, updateProgressDto);
  }

  @Get('plans/:id/progress')
  async getProgress(@Param('id', ParseUUIDPipe) id: string) {
    return this.improvementsService.getProgress(id);
  }

  @Post('plans/:id/accept')
  async acceptPlan(@Param('id', ParseUUIDPipe) id: string, @Body() acceptDto: AcceptPlanDto, @CurrentUser() user: any) {
    return this.improvementsService.acceptPlan(id, user.id, acceptDto);
  }

  @Get('plans/:id/acceptance')
  async getAcceptance(@Param('id', ParseUUIDPipe) id: string) {
    return this.improvementsService.getAcceptance(id);
  }

  @Post('plans/:id/submit')
  @HttpCode(HttpStatus.CREATED)
  async submitForApproval(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.improvementsService.submitForApproval(id, user.id);
  }

  @Get('plans/:id/approvals')
  async getApprovals(@Param('id', ParseUUIDPipe) id: string) {
    return this.improvementsService.getApprovals(id);
  }

  @Post('plans/approvals/:approvalId/approve')
  async approve(@Param('approvalId', ParseUUIDPipe) approvalId: string, @Body() body: { comments?: string }, @CurrentUser() user: any) {
    return this.improvementsService.approve(approvalId, user.id, body.comments);
  }

  @Post('plans/approvals/:approvalId/reject')
  async reject(@Param('approvalId', ParseUUIDPipe) approvalId: string, @Body() body: { comments: string }, @CurrentUser() user: any) {
    return this.improvementsService.reject(approvalId, user.id, body.comments);
  }

  @Get('stats')
  async getStats() {
    return this.improvementsService.getStats();
  }
}
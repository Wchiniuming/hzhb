import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  HttpCode, HttpStatus, ParseUUIDPipe, DefaultValuePipe, ParseIntPipe,
} from '@nestjs/common';
import { DevelopersService } from './developers.service';
import { CreateDeveloperDto, UpdateDeveloperDto, AddSkillDto, UpdateSkillDto, AddExperienceDto, AddCertificateDto } from './dto';
import { CurrentUser } from '../../auth/current-user.decorator';

@Controller('developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) {}

  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('partnerId') partnerId?: string,
    @Query('status') status?: string,
  ) {
    return this.developersService.findAll(page, limit, partnerId, status);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.developersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createDeveloperDto: CreateDeveloperDto) {
    return this.developersService.create(createDeveloperDto);
  }

  @Put(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateDeveloperDto: UpdateDeveloperDto) {
    return this.developersService.update(id, updateDeveloperDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.developersService.remove(id);
  }

  @Post(':id/skills')
  @HttpCode(HttpStatus.CREATED)
  async addSkill(@Param('id', ParseUUIDPipe) id: string, @Body() addSkillDto: AddSkillDto) {
    return this.developersService.addSkill(id, addSkillDto);
  }

  @Put(':id/skills/:skillTagId')
  async updateSkill(@Param('id', ParseUUIDPipe) id: string, @Param('skillTagId', ParseUUIDPipe) skillTagId: string, @Body() updateSkillDto: UpdateSkillDto) {
    return this.developersService.updateSkill(id, skillTagId, updateSkillDto);
  }

  @Delete(':id/skills/:skillTagId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSkill(@Param('id', ParseUUIDPipe) id: string, @Param('skillTagId', ParseUUIDPipe) skillTagId: string) {
    return this.developersService.removeSkill(id, skillTagId);
  }

  @Post(':id/experiences')
  @HttpCode(HttpStatus.CREATED)
  async addExperience(@Param('id', ParseUUIDPipe) id: string, @Body() addExperienceDto: AddExperienceDto) {
    return this.developersService.addExperience(id, addExperienceDto);
  }

  @Put(':id/experiences/:experienceId')
  async updateExperience(@Param('id', ParseUUIDPipe) id: string, @Param('experienceId', ParseUUIDPipe) experienceId: string, @Body() updateDto: AddExperienceDto) {
    return this.developersService.updateExperience(id, experienceId, updateDto);
  }

  @Delete(':id/experiences/:experienceId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeExperience(@Param('id', ParseUUIDPipe) id: string, @Param('experienceId', ParseUUIDPipe) experienceId: string) {
    return this.developersService.removeExperience(id, experienceId);
  }

  @Post(':id/certificates')
  @HttpCode(HttpStatus.CREATED)
  async addCertificate(@Param('id', ParseUUIDPipe) id: string, @Body() addCertificateDto: AddCertificateDto) {
    return this.developersService.addCertificate(id, addCertificateDto);
  }

  @Delete(':id/certificates/:certificateId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeCertificate(@Param('id', ParseUUIDPipe) id: string, @Param('certificateId', ParseUUIDPipe) certificateId: string) {
    return this.developersService.removeCertificate(id, certificateId);
  }

  @Post(':id/submit')
  @HttpCode(HttpStatus.CREATED)
  async submitForApproval(@Param('id', ParseUUIDPipe) id: string, @CurrentUser() user: any) {
    return this.developersService.submitForApproval(id, user.id);
  }

  @Post(':id/approvals/:approvalId/approve')
  async approve(@Param('id', ParseUUIDPipe) id: string, @Param('approvalId', ParseUUIDPipe) approvalId: string, @Body() body: { comments?: string }, @CurrentUser() user: any) {
    return this.developersService.approve(approvalId, user.id, body.comments);
  }

  @Post(':id/approvals/:approvalId/reject')
  async reject(@Param('id', ParseUUIDPipe) id: string, @Param('approvalId', ParseUUIDPipe) approvalId: string, @Body() body: { comments: string }, @CurrentUser() user: any) {
    return this.developersService.reject(approvalId, user.id, body.comments);
  }

  @Get(':id/approvals')
  async getApprovals(@Param('id', ParseUUIDPipe) id: string) {
    return this.developersService.getApprovals(id);
  }
}
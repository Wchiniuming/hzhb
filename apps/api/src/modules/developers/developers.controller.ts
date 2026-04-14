import {
  Controller, Get, Post, Put, Delete, Body, Param, Query,
  HttpCode, HttpStatus, Patch,
} from '@nestjs/common';
import { DevelopersService } from './developers.service';

@Controller('developers')
export class DevelopersController {
  constructor(private readonly developersService: DevelopersService) {}

  @Get()
  async findAll(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
    @Query('search') search?: string,
    @Query('partnerId') partnerId?: string,
    @Query('status') status?: string,
  ) {
    return this.developersService.findAll({
      page: parseInt(page),
      pageSize: parseInt(pageSize),
      search,
      partnerId,
      status,
    });
  }

  @Get('stats')
  async getStats() {
    return this.developersService.getStats();
  }

  @Get('skills')
  async getAllSkills() {
    return this.developersService.getAllSkills();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.developersService.findOne(id);
  }

  @Get(':id/details')
  async getDetails(@Param('id') id: string) {
    return this.developersService.getDetails(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDeveloperDto: {
      name: string;
      partnerId: string;
      gender?: string;
      age?: number;
      contact?: any;
      status?: string;
      skillIds?: string[];
    }
  ) {
    return this.developersService.create(createDeveloperDto);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDeveloperDto: {
      name?: string;
      gender?: string;
      age?: number;
      contact?: any;
      status?: string;
    }
  ) {
    return this.developersService.update(id, updateDeveloperDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.developersService.remove(id);
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.developersService.updateStatus(id, body.status);
  }

  @Post(':id/skills')
  @HttpCode(HttpStatus.CREATED)
  async addSkills(
    @Param('id') id: string,
    @Body() body: { skillIds: string[]; proficiency?: string },
  ) {
    return this.developersService.addSkills(id, body.skillIds, body.proficiency);
  }

  @Delete(':id/skills/:skillId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeSkill(
    @Param('id') id: string,
    @Param('skillId') skillId: string,
  ) {
    return this.developersService.removeSkill(id, skillId);
  }

  @Post(':id/experiences')
  @HttpCode(HttpStatus.CREATED)
  async addExperience(
    @Param('id') id: string,
    @Body() experienceDto: {
      projectName: string;
      role?: string;
      startDate: Date;
      endDate?: Date;
      description?: string;
    }
  ) {
    return this.developersService.addExperience(id, experienceDto);
  }

  @Put(':id/experiences/:expId')
  async updateExperience(
    @Param('id') id: string,
    @Param('expId') expId: string,
    @Body() experienceDto: {
      projectName?: string;
      role?: string;
      startDate?: Date;
      endDate?: Date;
      description?: string;
    }
  ) {
    return this.developersService.updateExperience(id, expId, experienceDto);
  }

  @Delete(':id/experiences/:expId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeExperience(
    @Param('id') id: string,
    @Param('expId') expId: string,
  ) {
    return this.developersService.removeExperience(id, expId);
  }

  @Post(':id/certificates')
  @HttpCode(HttpStatus.CREATED)
  async addCertificate(
    @Param('id') id: string,
    @Body() certificateDto: {
      name: string;
      issuingBody?: string;
      issueDate: Date;
      expireDate?: Date;
      attachmentId?: string;
    }
  ) {
    return this.developersService.addCertificate(id, certificateDto);
  }

  @Delete(':id/certificates/:certId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeCertificate(
    @Param('id') id: string,
    @Param('certId') certId: string,
  ) {
    return this.developersService.removeCertificate(id, certId);
  }

  @Post(':id/approve')
  @HttpCode(HttpStatus.OK)
  async approve(
    @Param('id') id: string,
    @Body() body: { status: string; comments?: string },
  ) {
    return this.developersService.approve(id, body.status, body.comments);
  }
}

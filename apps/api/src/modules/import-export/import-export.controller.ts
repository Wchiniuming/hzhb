import {
  Controller,
  Get,
  Post,
  Query,
  Res,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import type { Response } from 'express';
import { ImportExportService } from './import-export.service';
import { Public } from '../../auth/public.decorator';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('import-export')
export class ImportExportController {
  constructor(private readonly importExportService: ImportExportService) {}

  @Get('export/partners')
  async exportPartners(@Res() res: Response) {
    const data = await this.importExportService.exportPartners();
    const buffer = await this.importExportService.exportToExcel('合作伙伴', data, 'partners.xlsx');
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=partners.xlsx');
    res.send(buffer);
  }

  @Get('export/developers')
  async exportDevelopers(@Res() res: Response) {
    const data = await this.importExportService.exportDevelopers();
    const buffer = await this.importExportService.exportToExcel('开发人员', data, 'developers.xlsx');
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=developers.xlsx');
    res.send(buffer);
  }

  @Get('export/tasks')
  async exportTasks(@Res() res: Response) {
    const data = await this.importExportService.exportTasks();
    const buffer = await this.importExportService.exportToExcel('任务', data, 'tasks.xlsx');
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=tasks.xlsx');
    res.send(buffer);
  }

  @Get('export/risks')
  async exportRisks(@Res() res: Response) {
    const data = await this.importExportService.exportRisks();
    const buffer = await this.importExportService.exportToExcel('风险', data, 'risks.xlsx');
    
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=risks.xlsx');
    res.send(buffer);
  }

  @Post('import/partners')
  @UseInterceptors(FileInterceptor('file'))
  async importPartners(@UploadedFile() file: any) {
    const data = await this.importExportService.importFromExcel(file.buffer, 'partners');
    const parsed = data.map(row => this.importExportService.parseImportData(row, 'partners'));
    return { success: true, imported: parsed.length, data: parsed };
  }

  @Post('import/developers')
  @UseInterceptors(FileInterceptor('file'))
  async importDevelopers(@UploadedFile() file: any) {
    const data = await this.importExportService.importFromExcel(file.buffer, 'developers');
    const parsed = data.map(row => this.importExportService.parseImportData(row, 'developers'));
    return { success: true, imported: parsed.length, data: parsed };
  }

  @Post('import/tasks')
  @UseInterceptors(FileInterceptor('file'))
  async importTasks(@UploadedFile() file: any) {
    const data = await this.importExportService.importFromExcel(file.buffer, 'tasks');
    const parsed = data.map(row => this.importExportService.parseImportData(row, 'tasks'));
    return { success: true, imported: parsed.length, data: parsed };
  }

  @Post('import/risks')
  @UseInterceptors(FileInterceptor('file'))
  async importRisks(@UploadedFile() file: any) {
    const data = await this.importExportService.importFromExcel(file.buffer, 'risks');
    const parsed = data.map(row => this.importExportService.parseImportData(row, 'risks'));
    return { success: true, imported: parsed.length, data: parsed };
  }
}

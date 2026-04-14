import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ImportExportService {
  constructor(private readonly prisma: PrismaService) {}

  async exportToExcel(modelName: string, data: any[], filename: string): Promise<Buffer> {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, modelName);
    
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return Buffer.from(excelBuffer);
  }

  async importFromExcel(fileBuffer: Buffer, modelName: string): Promise<any[]> {
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    return jsonData;
  }

  async exportPartners() {
    const partners = await this.prisma.partner.findMany();
    
    return partners.map(p => ({
      名称: p.name,
      状态: p.status,
      联系方式: p.contactInfo,
      创建时间: p.createdAt,
    }));
  }

  async exportDevelopers() {
    const developers = await this.prisma.developer.findMany();
    
    return developers.map(d => ({
      姓名: d.name,
      性别: d.gender,
      年龄: d.age,
      联系电话: d.contact,
      所属公司ID: d.partnerId,
      状态: d.status,
      创建时间: d.createdAt,
    }));
  }

  async exportTasks() {
    const tasks = await this.prisma.task.findMany();
    
    return tasks.map(t => ({
      任务名称: t.name,
      描述: t.description,
      类型: t.type,
      优先级: t.priority,
      状态: t.status,
      合作伙伴ID: t.partnerId,
      开始日期: t.startDate,
      结束日期: t.endDate,
      预算: t.budget,
      创建时间: t.createdAt,
    }));
  }

  async exportRisks() {
    const risks = await this.prisma.risk.findMany();
    
    return risks.map(r => ({
      风险名称: r.name,
      描述: r.description,
      等级: r.level,
      影响: r.impact,
      触发条件: r.triggerConditions,
      处置措施: r.dispositionMeasures,
      创建时间: r.createdAt,
    }));
  }

  parseImportData(data: any[], model: string): any {
    const mapped: any = {};
    
    const fieldMappings: Record<string, string> = {
      '名称': 'name',
      '姓名': 'name',
      '任务名称': 'name',
      '风险名称': 'name',
      '描述': 'description',
      '性别': 'gender',
      '年龄': 'age',
      '联系电话': 'contact',
      '联系方式': 'contactInfo',
      '类型': 'type',
      '优先级': 'priority',
      '等级': 'level',
      '影响': 'impact',
      '触发条件': 'triggerConditions',
      '处置措施': 'dispositionMeasures',
      '状态': 'status',
    };

    for (const [cn, en] of Object.entries(fieldMappings)) {
      if ((data as any)[cn] !== undefined) {
        mapped[en] = (data as any)[cn];
      }
    }
    
    return mapped;
  }
  
  async importPartners(data: any[]) {
    const results = [];
    for (const row of data) {
      const mapped = this.parseImportData(row, 'partner');
      if (mapped.name) {
        try {
          const partner = await this.prisma.partner.create({ data: mapped });
          results.push({ success: true, data: partner });
        } catch (e) {
          results.push({ success: false, error: e.message, data: row });
        }
      }
    }
    return results;
  }
  
  async importDevelopers(data: any[]) {
    const results = [];
    for (const row of data) {
      const mapped = this.parseImportData(row, 'developer');
      if (mapped.name) {
        try {
          const developer = await this.prisma.developer.create({ data: mapped });
          results.push({ success: true, data: developer });
        } catch (e) {
          results.push({ success: false, error: e.message, data: row });
        }
      }
    }
    return results;
  }
  
  async importTasks(data: any[]) {
    const results = [];
    for (const row of data) {
      const mapped = this.parseImportData(row, 'task');
      if (mapped.name) {
        try {
          const task = await this.prisma.task.create({ data: mapped });
          results.push({ success: true, data: task });
        } catch (e) {
          results.push({ success: false, error: e.message, data: row });
        }
      }
    }
    return results;
  }
  
  async importRisks(data: any[]) {
    const results = [];
    for (const row of data) {
      const mapped = this.parseImportData(row, 'risk');
      if (mapped.name) {
        try {
          const risk = await this.prisma.risk.create({ data: mapped });
          results.push({ success: true, data: risk });
        } catch (e) {
          results.push({ success: false, error: e.message, data: row });
        }
      }
    }
    return results;
  }
}

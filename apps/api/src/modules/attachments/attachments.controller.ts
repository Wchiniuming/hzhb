import {
  Controller,
  Post,
  Get,
  Delete,
  Param,
  UseInterceptors,
  UploadedFile,
  Res,
  Query,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, unlinkSync } from 'fs';
import { PrismaService } from '../../prisma/prisma.service';
import { Public } from '../../auth/public.decorator';
import * as fs from 'fs';

const storage = diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads';
    if (!existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req: any, file: Express.Multer.File, cb: Function) => {
  const allowedMimes = [
    'image/jpeg',
    'image/png',
    'image/gif',
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv',
    'application/zip',
  ];
  
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new BadRequestException('不支持的文件类型'), false);
  }
};

@Controller('attachments')
export class AttachmentsController {
  constructor(private readonly prisma: PrismaService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage,
    fileFilter,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  }))
  async uploadFile(
    @UploadedFile() file: any,
  ) {
    if (!file) {
      throw new BadRequestException('请选择要上传的文件');
    }

    const attachment = await this.prisma.attachment.create({
      data: {
        originalFilename: file.originalname,
        storedFilename: file.filename,
        contentType: file.mimetype,
        fileSize: file.size,
        storageKey: file.path,
        uploadedBy: 'system',
      },
    });

    return {
      id: attachment.id,
      filename: attachment.originalFilename,
      url: `/api/attachments/${attachment.id}`,
      size: attachment.fileSize,
      contentType: attachment.contentType,
    };
  }

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id },
    });

    if (!attachment) {
      throw new NotFoundException('文件不存在');
    }

    const filePath = join(process.cwd(), attachment.storageKey);

    if (!existsSync(filePath)) {
      throw new NotFoundException('文件已丢失');
    }

    res.setHeader('Content-Type', attachment.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${attachment.originalFilename}"`);
    res.sendFile(filePath);
  }

  @Get(':id/info')
  async getFileInfo(@Param('id') id: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id },
    });

    if (!attachment) {
      throw new NotFoundException('文件不存在');
    }

    return {
      id: attachment.id,
      filename: attachment.originalFilename,
      size: attachment.fileSize,
      contentType: attachment.contentType,
      uploadTime: attachment.uploadTime,
    };
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string) {
    const attachment = await this.prisma.attachment.findUnique({
      where: { id },
    });

    if (!attachment) {
      throw new NotFoundException('文件不存在');
    }

    const filePath = join(process.cwd(), attachment.storageKey);
    if (existsSync(filePath)) {
      unlinkSync(filePath);
    }

    await this.prisma.attachment.delete({ where: { id } });

    return { success: true };
  }

  @Get()
  async listFiles(
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '20',
  ) {
    const pageNum = parseInt(page);
    const pageSizeNum = parseInt(pageSize);
    const skip = (pageNum - 1) * pageSizeNum;

    const [files, total] = await Promise.all([
      this.prisma.attachment.findMany({
        skip,
        take: pageSizeNum,
        orderBy: { uploadTime: 'desc' },
      }),
      this.prisma.attachment.count(),
    ]);

    return {
      items: files.map(f => ({
        id: f.id,
        filename: f.originalFilename,
        size: f.fileSize,
        contentType: f.contentType,
        uploadTime: f.uploadTime,
      })),
      total,
      page: pageNum,
      pageSize: pageSizeNum,
      totalPages: Math.ceil(total / pageSizeNum),
    };
  }
}

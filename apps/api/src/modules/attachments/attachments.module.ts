import { Module } from '@nestjs/common';
import { AttachmentsController } from './attachments.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AttachmentsController],
  exports: [AttachmentsController],
})
export class AttachmentsModule {}

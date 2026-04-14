import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { ImportExportController } from './import-export.controller';
import { ImportExportService } from './import-export.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    MulterModule.register({
      limits: {
        fileSize: 10 * 1024 * 1024, // 10MB
      },
    }),
    PrismaModule,
  ],
  controllers: [ImportExportController],
  providers: [ImportExportService],
  exports: [ImportExportService],
})
export class ImportExportModule {}

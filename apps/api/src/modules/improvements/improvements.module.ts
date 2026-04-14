import { Module } from '@nestjs/common';
import { ImprovementsService } from './improvements.service';
import { ImprovementsController } from './improvements.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ImprovementsController],
  providers: [ImprovementsService],
  exports: [ImprovementsService],
})
export class ImprovementsModule {}
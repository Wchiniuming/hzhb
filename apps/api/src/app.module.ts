import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { PartnersModule } from './modules/partners/partners.module';
import { DevelopersModule } from './modules/developers/developers.module';
import { TasksModule } from './modules/tasks/tasks.module';
import { AssessmentsModule } from './modules/vendors/assessments.module';
import { ImprovementsModule } from './modules/improvements/improvements.module';
import { RisksModule } from './modules/risks/risks.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [jwtConfig],
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    PartnersModule,
    DevelopersModule,
    TasksModule,
    AssessmentsModule,
    ImprovementsModule,
    RisksModule,
    UsersModule,
    RolesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

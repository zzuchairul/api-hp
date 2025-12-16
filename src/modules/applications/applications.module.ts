import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditModule } from '../audit/audit.module';
import { JobPosterModule } from '../job-posters/job-posters.module';
import { JobPosterRepository } from '../job-posters/job-posters.repository';
import { UsersModule } from '../users/users.module';
import { Application } from './application.entity';
import { ApplicationsController } from './applications.controller';
import { ApplicationsService } from './applications.service';
import { ApplicationProcessor } from './proccessor/application.proccessor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Application]),
    BullModule.registerQueue({
      name: 'applications',
    }),
    UsersModule,
    JobPosterModule,
    AuditModule,
  ],
  controllers: [ApplicationsController],
  providers: [ApplicationsService, ApplicationProcessor, JobPosterRepository],
})
export class ApplicationsModule {}

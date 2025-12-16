import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesModule } from '../companies/companies.module';
import { JobPoster } from './job-poster.entity';
import { JobPosterController } from './job-posters.controller';
import { JobPosterRepository } from './job-posters.repository';
import { JobPosterService } from './job-posters.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobPoster]), CompaniesModule],
  controllers: [JobPosterController],
  providers: [JobPosterService, JobPosterRepository],
  exports: [JobPosterService, JobPosterRepository],
})
export class JobPosterModule {}

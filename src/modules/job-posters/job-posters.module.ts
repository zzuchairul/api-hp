import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompaniesRepository } from '../companies/companies.repository';
import { Company } from '../companies/company.entity';
import { JobPoster } from './job-poster.entity';
import { JobPosterController } from './job-posters.controller';
import { JobPosterRepository } from './job-posters.repository';
import { JobPosterService } from './job-posters.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobPoster, Company])],
  controllers: [JobPosterController],
  providers: [JobPosterService, JobPosterRepository, CompaniesRepository],
  exports: [JobPosterService],
})
export class JobPosterModule {}

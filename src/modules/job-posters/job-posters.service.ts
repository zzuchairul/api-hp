import { Injectable, NotFoundException } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CompaniesRepository } from '../companies/companies.repository';
import { CreateJobPosterDto } from './dto/create-job-poster.dto';
import { FindJobPosterDto } from './dto/find-job-poster.dto';
import { PublicJobPosterDto } from './dto/public-job-poster.dto';
import { JobPosterRepository } from './job-posters.repository';

@Injectable()
export class JobPosterService {
  constructor(
    private jobPosterRepository: JobPosterRepository,
    private CompaniesRepository: CompaniesRepository,
  ) {}
  async create(createJobPosterDto: CreateJobPosterDto, userId: string) {
    const company = await this.CompaniesRepository.findOne({
      where: { creatorId: userId },
    });

    if (!company) {
      throw new NotFoundException(`Create your companies first!`);
    }

    const data = await this.jobPosterRepository.createJobPoster({
      ...createJobPosterDto,
      userId,
      companyId: company.id,
    });
    return data;
  }

  async find(options: FindJobPosterDto) {
    const { data, meta } = await this.jobPosterRepository.findList(options);
    const companyData = plainToInstance(PublicJobPosterDto, data, {
      excludeExtraneousValues: true,
    });

    return { data: companyData, meta };
  }
}

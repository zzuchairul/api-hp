import {
  getPaginationClause,
  getPaginationParams,
  paginate,
} from '@/common/pagination/paginate';
import { PaginateResult } from '@/common/pagination/paginate.interface';
import { Injectable } from '@nestjs/common';
import { DataSource, FindManyOptions, Repository } from 'typeorm';
import { FindJobPosterDto } from './dto/find-job-poster.dto';
import { JobPoster } from './job-poster.entity';

@Injectable()
export class JobPosterRepository extends Repository<JobPoster> {
  constructor(private dataSource: DataSource) {
    super(JobPoster, dataSource.createEntityManager());
  }

  async createJobPoster(data: Partial<JobPoster>): Promise<JobPoster> {
    const jobPoster = this.create(data);
    return await this.save(jobPoster);
  }

  async findList(
    options: FindJobPosterDto,
  ): Promise<PaginateResult<JobPoster[]>> {
    const {
      searchBy,
      searchVal,
      orderBy = 'created_at',
      orderVal = 'DESC',
      page = 1,
      limit = 10,
    } = options;

    const paginationParams = getPaginationParams({ page, limit });
    const paginationClause = getPaginationClause({
      searchBy,
      searchVal,
      orderBy,
      orderVal,
    });

    const clause: FindManyOptions<JobPoster> = {
      ...paginationClause,
      ...paginationParams,
      relations: ['user', 'company'],
    };

    const [data, total] = await this.findAndCount(clause);

    return paginate(data, total, { page, limit });
  }
}

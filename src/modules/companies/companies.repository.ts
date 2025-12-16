import {
  getPaginationClause,
  getPaginationParams,
  paginate,
} from '@/common/pagination/paginate';
import type { PaginateResult } from '@/common/pagination/paginate.interface';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository, type FindManyOptions } from 'typeorm';
import { Company } from './company.entity';
import { FindCompaniesDto } from './dto/find-companies.dto';

@Injectable()
export class CompaniesRepository extends Repository<Company> {
  constructor(private dataSource: DataSource) {
    super(Company, dataSource.createEntityManager());
  }

  async createCompany(data: Partial<Company>): Promise<Company> {
    const company = this.create(data);
    return await this.save(company);
  }

  async findList(
    options: FindCompaniesDto,
  ): Promise<PaginateResult<Company[]>> {
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

    const clause: FindManyOptions<Company> = {
      ...paginationClause,
      ...paginationParams,
      relations: ['creator'],
    };

    const [data, total] = await this.findAndCount(clause);

    return paginate(data, total, { page, limit });
  }
}

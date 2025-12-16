// src/modules/companies/companies.service.ts
import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import type { JwtPayload } from '../auth/types/jwt-payload.interface';
import { CompaniesRepository } from './companies.repository';
import { CreateCompanyDto } from './dto/create-company.dto';
import { FindCompaniesDto } from './dto/find-companies.dto';
import { PublicCompanyDto } from './dto/public-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Injectable()
export class CompaniesService {
  constructor(private companiesRepository: CompaniesRepository) {}
  async create(dto: CreateCompanyDto, userId: string) {
    const company = this.companiesRepository.createCompany({
      ...dto,
      creatorId: userId,
    });

    return company;
  }

  async find(options: FindCompaniesDto) {
    const { data, meta } = await this.companiesRepository.findList(options);
    const companyData = plainToInstance(PublicCompanyDto, data, {
      excludeExtraneousValues: true,
    });

    return { data: companyData, meta };
  }

  async findOne(id: string) {
    const company = await this.companiesRepository.findOne({
      where: { id },
      relations: ['creator'],
    });

    if (!company) {
      throw new NotFoundException('Company not found');
    }

    return plainToInstance(PublicCompanyDto, company, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, dto: UpdateCompanyDto, user: JwtPayload) {
    const company = await this.findOne(id);
    if (!company) {
      throw new NotFoundException('Company not found');
    }

    if (company.creator?.id !== user.sub) {
      throw new ForbiddenException('You can only update your own company');
    }

    Object.assign(company, dto);
    const updatedCompany = this.companiesRepository.save(company);
    return plainToInstance(PublicCompanyDto, updatedCompany, {
      excludeExtraneousValues: true,
    });
  }
}

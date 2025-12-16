// src/modules/companies/companies.controller.ts
import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtPayload } from '../auth/types/jwt-payload.interface';
import { UserRole } from '../users/user.entity';
import {
  ApiCreateCompanyResponse,
  ApiFindOneResponse,
  ApiListResponse,
} from './companies.documentation';
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { FindCompaniesDto } from './dto/find-companies.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {}

  @Roles(UserRole.RECRUITER)
  @Post()
  @ApiCreateCompanyResponse()
  async create(@Body() dto: CreateCompanyDto, @GetUser() user: JwtPayload) {
    return this.companiesService.create(dto, user.sub);
  }

  @Public()
  @Get()
  @ApiListResponse()
  async findList(@Query() query: FindCompaniesDto) {
    return this.companiesService.find(query);
  }

  @Public()
  @Get(':id')
  @ApiFindOneResponse()
  findOne(@Param('id') id: string) {
    return this.companiesService.findOne(id);
  }

  @Roles(UserRole.RECRUITER)
  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateCompanyDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.companiesService.update(id, dto, user);
  }
}

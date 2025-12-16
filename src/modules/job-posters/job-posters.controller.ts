import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { type JwtPayload } from '../auth/types/jwt-payload.interface';
import { ApiListResponse } from '../companies/companies.documentation';
import { UserRole } from '../users/user.entity';
import { CreateJobPosterDto } from './dto/create-job-poster.dto';
import { FindJobPosterDto } from './dto/find-job-poster.dto';
import { JobPosterService } from './job-posters.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('job-poster')
export class JobPosterController {
  constructor(private readonly jobPosterService: JobPosterService) {}

  @Roles(UserRole.RECRUITER)
  @Post()
  async create(
    @Body() createJobPosterDto: CreateJobPosterDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.jobPosterService.create(createJobPosterDto, user.sub);
  }

  @Public()
  @Get()
  @ApiListResponse()
  async findList(@Query() query: FindJobPosterDto) {
    return this.jobPosterService.find(query);
  }
}

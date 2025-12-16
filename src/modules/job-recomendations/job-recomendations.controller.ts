import { Controller, Get, UseGuards } from '@nestjs/common';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { JwtPayload } from '../auth/types/jwt-payload.interface';
import { UserRole } from '../users/user.entity';
import { ApiJobRecomendationsResponse } from './job-recomendations.documentation';
import { JobRecomendationService } from './job-recomendations.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('job-recomendations')
export class JobRecomendationController {
  constructor(private readonly jobsService: JobRecomendationService) {}

  @Roles(UserRole.CANDIDATE)
  @ApiJobRecomendationsResponse()
  @Get('recommended/')
  async findRecomendation(@GetUser() user: JwtPayload) {
    return this.jobsService.getRecommendedJobs(user.sub);
  }
}

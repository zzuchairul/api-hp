import { RedisCacheService } from '@/shared/redis/redis.service';
import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { catchError, timeout } from 'rxjs/operators';
import { Repository } from 'typeorm';
import { Application } from '../applications/application.entity';
import { JobRecomendation } from './job-recomendations.interface';

@Injectable()
export class JobRecomendationService {
  private readonly logger = new Logger(JobRecomendationService.name);
  private readonly externalUrl: string;
  private readonly requestTimeoutMs = 8000;
  private readonly cacheTTL = 600;

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    private readonly redisCache: RedisCacheService,
  ) {
    this.externalUrl = 'https://arbeitnow.com/api/job-board-api';
  }

  async getRecommendedJobs(
    userId: string,
    limit = 5,
  ): Promise<Partial<JobRecomendation>[]> {
    if (limit < 1) return [];

    const cacheKey = `recommended_jobs:${userId}`;

    const cachedJobs =
      await this.redisCache.get<Partial<JobRecomendation>[]>(cacheKey);

    let jobs: Partial<JobRecomendation>[];

    if (cachedJobs) {
      this.logger.debug(`Cache hit (BullMQ Redis) for user ${userId}`);
      jobs = cachedJobs;
    } else {
      this.logger.debug(`Cache miss – fetching from API for user ${userId}`);
      const appliedCount = await this.applicationRepository.count({
        where: { candidate: { id: userId } },
      });

      try {
        const response = await firstValueFrom(
          this.httpService
            .get<{
              data: Partial<JobRecomendation>[];
            }>(`${this.externalUrl}?page=${appliedCount + 1}`)
            .pipe(
              timeout(this.requestTimeoutMs),
              catchError((error: any) => {
                if (error.name === 'TimeoutError') {
                  this.logger.warn('Job API timeout');
                } else {
                  this.logger.error('Failed to fetch jobs', error.message);
                }
                throw new InternalServerErrorException(
                  'Job service unavailable',
                );
              }),
            ),
        );

        jobs = response.data?.data ?? [];

        await this.redisCache.set(cacheKey, jobs, this.cacheTTL);
      } catch (error) {
        if (cachedJobs) {
          this.logger.warn('API failed – serving stale cached jobs');
          jobs = cachedJobs;
        } else {
          throw error;
        }
      }
    }

    return jobs;
  }
}

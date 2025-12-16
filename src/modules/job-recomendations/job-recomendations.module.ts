// src/job-recomendations/job-recomendation.module.ts
import { RedisModule } from '@/shared/redis/redis.module';
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Application } from '../applications/application.entity';
import { JobRecomendationController } from './job-recomendations.controller';
import { JobRecomendationService } from './job-recomendations.service';

@Module({
  imports: [HttpModule, TypeOrmModule.forFeature([Application]), RedisModule],
  controllers: [JobRecomendationController],
  providers: [JobRecomendationService],
})
export class JobRecomendationModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseConfig } from './configs/database.config';
import { jwtConfig } from './configs/jwt.config';
import { redisConfig } from './configs/redis.config';
import { ApplicationsModule } from './modules/applications/applications.module';
import { AuthModule } from './modules/auth/auth.module';
import { CompaniesModule } from './modules/companies/companies.module';
import { JobPosterModule } from './modules/job-posters/job-posters.module';
import { JobRecomendationModule } from './modules/job-recomendations/job-recomendations.module';
import { TypeOrmDatabaseModule } from './shared/database/typeorm.module';
import { RedisModule } from './shared/redis/redis.module';

@Module({
  imports: [
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
        transport:
          process.env.NODE_ENV !== 'production'
            ? {
                target: 'pino-pretty',
                options: {
                  colorize: true,
                  translateTime: 'yyyy-mm-dd HH:MM:ss',
                  ignore: 'pid,hostname',
                },
              }
            : undefined,
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, redisConfig],
    }),
    RedisModule,
    TypeOrmDatabaseModule,
    AuthModule,
    CompaniesModule,
    JobPosterModule,
    ApplicationsModule,
    JobRecomendationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

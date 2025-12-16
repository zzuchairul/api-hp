import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          url: configService.get<string>('database.url'),
          entities: [__dirname + '/../../**/*.entity.{js,ts}'],
          synchronize: false,
          logging: false,
        };
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class TypeOrmDatabaseModule {}

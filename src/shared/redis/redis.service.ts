// src/shared/redis/redis-cache.service.ts
import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

@Injectable()
export class RedisCacheService implements OnModuleInit {
  private readonly logger = new Logger(RedisCacheService.name);
  private redisClient!: Redis;

  constructor(@InjectQueue('dummy-cache') private readonly queue: Queue) {}

  onModuleInit() {
    const client = (this.queue as any).client as Redis;
    this.redisClient = client.duplicate();
    this.logger.log('RedisCacheService initialized');
  }

  async get<T>(key: string): Promise<T | null> {
    const data = await this.redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  async set(key: string, value: any, ttlSeconds = 3600): Promise<void> {
    await this.redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
  }

  async del(key: string): Promise<void> {
    await this.redisClient.del(key);
  }
}

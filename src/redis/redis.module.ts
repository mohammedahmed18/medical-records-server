import { CacheModule, Module } from '@nestjs/common';
import type { RedisClientOptions } from 'redis';
import * as redisStore from 'cache-manager-redis-store';
import { CacheService } from './cache.service';

@Module({
  imports: [
    CacheModule.register<RedisClientOptions>({
      store: redisStore,
      url: process.env.REDIS_URL,
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class RedisConfigModule {}

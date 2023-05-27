import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async set<T>(key: string, value: T) {
    Logger.debug(`CACHE: setting the value ${key}, ${JSON.stringify(value)}`);
    return await this.cacheManager.set(key, value, 5000);
  }
  async get<T>(key: string): Promise<T> {
    // await this.flushAll();
    //
    const v: T = await this.cacheManager.get(key);
    if (v)
      Logger.debug(
        `CACHE: get the value ${key} from cache : ${JSON.stringify(v)}`,
      );
    return v;
  }
  async evict(key: string) {
    return await this.cacheManager.del(key);
  }
  async flushAll() {
    return await this.cacheManager.reset();
  }
}

import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async storeName() {
    return await this.cacheManager.set('name', 'ahmed');
  }

  async getName() {
    return await this.cacheManager.get('name');
  }

  async flushAll() {
    return await this.cacheManager.store.reset();
  }
}

import { Controller, Get } from '@nestjs/common';
import { CacheService } from './redis/cache.service';

@Controller()
export class AppController {
  constructor(private readonly cache: CacheService) {}
  @Get('clear-cache')
  async clearCache() {
    await this.cache.flushAll();
    return 'cache is clear now';
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CachedUserInfo, JwtPayload } from 'src/common/types';
import { CacheService } from 'src/redis/cache.service';
import { UsersService } from 'src/users/users.service';
import { getUserCachedInfo } from 'src/utils/cacheKeys';

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    config: ConfigService,
    private readonly cache: CacheService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromExtractors([
          (req) => {
            let token = null;
            if (req && req.cookies) {
              token = req.cookies['token'];
            }
            return token;
          },
        ]),
      ]),
      secretOrKey: config.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const userCacheKey = getUserCachedInfo(payload.id);
    let cachedInfo = await this.cache.get<CachedUserInfo>(userCacheKey);
    if (!cachedInfo) {
      Logger.debug(`fetch user ${payload.name} from the db`);
      const user = await this.userService.findById(payload.id, {
        image_src: true,
      });
      await this.cache.set(userCacheKey, user);
      cachedInfo = { image_src: user.image_src };
    }

    Object.keys(payload).forEach((key) => {
      if (cachedInfo[key]) {
        payload[key] = cachedInfo[key];
      }
    });
    return payload;
  }
}

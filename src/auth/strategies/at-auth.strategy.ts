import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CachedUserInfo, JwtPayload } from 'src/common/types';
import { BASE_IMAGE_SIZE } from 'src/constants';
import { CacheService } from 'src/redis/cache.service';
import { UsersService } from 'src/users/users.service';
import { getUserCachedInfo } from 'src/utils/cacheKeys';
import { squarizeImage } from 'src/utils/resizeCloudinaryImage';

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
      const modifiedUser = {
        ...user,
        image_src: squarizeImage(user.image_src, BASE_IMAGE_SIZE),
      };
      await this.cache.set(userCacheKey, modifiedUser);
      cachedInfo = { ...modifiedUser };
    }

    Object.keys(payload).forEach((key) => {
      if (cachedInfo[key]) {
        payload[key] = cachedInfo[key];
      }
    });
    return payload;
  }
}

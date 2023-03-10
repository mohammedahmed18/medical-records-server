import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/common/types';

@Injectable()
export class AdminAtStrategy extends PassportStrategy(Strategy, 'admin-jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromExtractors([
          (req) => {
            let token = null;
            if (req && req.cookies) {
              token = req.cookies['aToken']; //admin token
            }
            return token;
          },
        ]),
      ]),
      secretOrKey: config.get<string>('ADMIN_JWT_SECRET'),
    });
  }

  validate(payload: JwtPayload) {
    // TODO get the user permissions here
    return payload;
  }
}

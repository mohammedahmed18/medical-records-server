import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class QrCodeStrategy extends PassportStrategy(Strategy, 'qr-jwt') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('qrCode'),
      secretOrKey: config.get<string>('QR_SECRET'),
    });
  }

  validate(payload) {
    return payload;
  }
}

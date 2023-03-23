import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class QrCodeStrategy extends PassportStrategy(Strategy, 'qr-jwt') {
  constructor(readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('qrCode'),
      secretOrKey: configService.get<string>('QR_SECRET'),
    });
  }

  async validate(payload) {
    return payload
  }
}

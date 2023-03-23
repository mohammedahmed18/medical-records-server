import { AuthGuard } from '@nestjs/passport';
import { applyDecorators, UseGuards } from '@nestjs/common';

export const QrDecorator = applyDecorators(UseGuards(AuthGuard('qr-jwt')));

import { AuthGuard } from '@nestjs/passport';
import { applyDecorators, UseGuards } from '@nestjs/common';

export const ValidateQrCode = () => applyDecorators(UseGuards(AuthGuard('qr-jwt')));

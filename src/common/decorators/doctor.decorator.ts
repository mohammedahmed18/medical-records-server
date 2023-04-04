import { applyDecorators, UseGuards } from '@nestjs/common';
import { DoctorGuard } from '../guards';

export const Doctor = () =>
  applyDecorators(UseGuards(DoctorGuard));

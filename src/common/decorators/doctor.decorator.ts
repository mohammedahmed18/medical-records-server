import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { DoctorGuard } from '../guards';

export const Doctor = () =>
  applyDecorators(UseGuards(DoctorGuard), SetMetadata('requireDoctor', true));

import { applyDecorators, SetMetadata } from '@nestjs/common';

export const Admin = () =>
  applyDecorators(
    SetMetadata('isAdmin', true), // so that the admin guard can take effect
  );

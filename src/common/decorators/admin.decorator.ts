import { Public } from 'src/common/decorators';
import { applyDecorators, SetMetadata } from '@nestjs/common';

export const Admin = () =>
  applyDecorators(
    Public(), // to disable global user auth
    SetMetadata('isAdmin', true), // so that the admin guard can take effect
  );

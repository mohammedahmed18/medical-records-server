import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('protected')
  protectedRoute() {
    return 'this route is protected';
  }
}

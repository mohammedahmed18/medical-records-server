import { DoctorsController } from './doctors.controller';
import { Module } from '@nestjs/common';

@Module({
  controllers: [DoctorsController],
  providers: [],
})
export class DoctorsModule {}

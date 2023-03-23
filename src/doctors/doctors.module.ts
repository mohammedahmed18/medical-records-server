import { DoctorsController } from './doctors.controller';
import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [DoctorsController],
  imports : [UsersModule],
  providers: [DoctorService],
})
export class DoctorsModule {}

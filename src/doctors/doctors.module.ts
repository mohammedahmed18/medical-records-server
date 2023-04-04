import { DoctorsController } from './doctors.controller';
import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { UsersModule } from 'src/users/users.module';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [DoctorsController],
  imports : [UsersModule],
  providers: [DoctorService  , PrismaService],
})
export class DoctorsModule {}

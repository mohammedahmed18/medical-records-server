import { DoctorsController } from './doctors.controller';
import { Module } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { UsersModule } from 'src/users/users.module';
import { MedicalRecordsService } from 'src/medicalRecords/medicalRecords.service';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  controllers: [DoctorsController],
  imports : [UsersModule],
  providers: [DoctorService , MedicalRecordsService , PrismaService],
})
export class DoctorsModule {}

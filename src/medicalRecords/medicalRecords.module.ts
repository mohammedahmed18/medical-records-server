import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { MedicalRecordsController } from './medicalRecords.controller';
import { MedicalRecordsService } from './medicalRecords.service';

@Module({
  imports: [DatabaseModule],
  controllers: [MedicalRecordsController],
  providers: [MedicalRecordsService],
})
export class MedicalRecordsModule {}

import { Module } from '@nestjs/common';
import { DoctorRequestController } from './DoctorRequest.controller';
import { DoctorRequestService } from './DoctorRequest.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [DoctorRequestController],
  providers: [DoctorRequestService],
})
export class DoctorRequestModule {}

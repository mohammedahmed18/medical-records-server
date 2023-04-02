import { Doctor } from './../common/decorators/doctor.decorator';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { DOCTORS_BASE_URL } from 'src/constants';
import { DoctorService } from './doctor.service';
import { getQrNationalId, ValidateQrCode } from './decorators';
import { UseValidation, getCurrentUser } from 'src/common/decorators';
import { MedicalRecordsService } from 'src/medicalRecords/medicalRecords.service';
import { createMedicalRecordSchema , ScanQrCodeSchema} from './validation';
import { CreateUserMedicalRecordInput } from 'src/graphql';

@Controller(DOCTORS_BASE_URL)
@Doctor()
export class DoctorsController {
  constructor(private readonly doctorService : DoctorService,
    private readonly medicalRecordsService : MedicalRecordsService){}

  
  @Post("scan-qrCode")
  @ValidateQrCode()
  @UseValidation(ScanQrCodeSchema)
  @HttpCode(HttpStatus.OK)
  async scanQrCode(@Body() data ,@getQrNationalId() nationalId ) {
    return this.doctorService.scanQrCode(nationalId);
  }

  @Post("create-medical-record")
  @UseValidation(createMedicalRecordSchema)
  async createMedicalRecord(@getCurrentUser("id") doctorId : string , @Body() data : CreateUserMedicalRecordInput){
    return this.medicalRecordsService.createUserMedicalRecord(doctorId , data);
  }
}

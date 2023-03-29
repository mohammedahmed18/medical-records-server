import { Doctor } from './../common/decorators/doctor.decorator';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { DOCTORS_BASE_URL } from 'src/constants';
import { DoctorService } from './doctor.service';
import { getQrNationalId, ValidateQrCode } from './decorators';
import { UseValidation } from 'src/common/decorators';
import { ScanQrCodeSchema } from './validation/scanQrCode.schema';
import { MedicalRecordsService } from 'src/medicalRecords/medicalRecords.service';

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

  // @Post("create-medical-record")
  // async createMedicalRecord(){
  //   return this.medicalRecordsService.
  // }
}

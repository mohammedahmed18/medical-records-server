import { Doctor } from './../common/decorators/doctor.decorator';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { DOCTORS_BASE_URL } from 'src/constants';
import { DoctorService } from './doctor.service';
import { getQrNationalId, ValidateQrCode } from './decorators';
import { UseValidation, getCurrentUser } from 'src/common/decorators';
import { ScanQrCodeSchema} from './validation';

@Controller(DOCTORS_BASE_URL)
@Doctor()
export class DoctorsController {
  constructor(private readonly doctorService : DoctorService){}

  
  @Post("scan-qrCode")
  @ValidateQrCode()
  @UseValidation(ScanQrCodeSchema)
  @HttpCode(HttpStatus.OK)
  async scanQrCode(@Body() data ,@getQrNationalId() patientNationalId , @getCurrentUser("nationalId") doctorNationalId ) {
    return {patientNationalId , doctorNationalId}
    // return this.doctorService.scanQrCode(patientNationalId , doctorNationalId);
  }

}

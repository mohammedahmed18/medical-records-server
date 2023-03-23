import { Doctor } from './../common/decorators/doctor.decorator';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { DOCTORS_BASE_URL } from 'src/constants';
import { DoctorService } from './doctor.service';
import { getQrNationalId, ValidateQrCode } from './decorators';
import { UseValidation } from 'src/common/decorators';
import { ScanQrCodeSchema } from './validation/scanQrCode.schema';

@Controller(DOCTORS_BASE_URL)
@Doctor()
export class DoctorsController {
  constructor(private readonly doctorService : DoctorService){}

  
  @Post("scan-qrCode")
  @ValidateQrCode()
  @UseValidation(ScanQrCodeSchema)
  @HttpCode(HttpStatus.OK)
  async scanQrCode(@Body() data ,@getQrNationalId() nationalId ) {
    return this.doctorService.scanQrCode(nationalId);
  }
}

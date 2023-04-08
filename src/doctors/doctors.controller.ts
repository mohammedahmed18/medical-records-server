import { Doctor } from './../common/decorators/doctor.decorator';
import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import { DOCTORS_BASE_URL } from 'src/constants';
import { DoctorService } from './doctor.service';
import { getQrNationalId, ValidateQrCode } from './decorators';
import { UseValidation, getCurrentUser } from 'src/common/decorators';
import { ScanQrCodeSchema} from './validation';

@Controller(DOCTORS_BASE_URL)
export class DoctorsController {
  constructor(private readonly doctorService : DoctorService){}

  
  @Post("scan-qrCode")
  @ValidateQrCode()
  @UseValidation(ScanQrCodeSchema)
  @Doctor()
  @HttpCode(HttpStatus.OK)
  async scanQrCode(@Body() data ,@getQrNationalId() patientNationalId , @getCurrentUser("nationalId") doctorNationalId ) {
    return this.doctorService.scanQrCode(patientNationalId , doctorNationalId);
  }


  @Get()
  async getDoctors(
    @Query("medicalSpecialization") medicalSpecialization,
    @Query("perPage") perPage,
    @Query("cursor") cursor
    ){
    return  await this.doctorService.getAllDoctors({medicalSpecialization , cursor , perPage});
  }

}

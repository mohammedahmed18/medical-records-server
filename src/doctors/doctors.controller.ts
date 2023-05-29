import { Doctor } from './../common/decorators/doctor.decorator';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { DOCTORS_BASE_URL } from 'src/constants';
import { DoctorService } from './doctor.service';
import { getQrNationalId, getQrPatientId, ValidateQrCode } from './decorators';
import { UseValidation, getCurrentUser } from 'src/common/decorators';
import { MakeReviewSchema, ScanQrCodeSchema } from './validation';
import { MedicalRecordsService } from 'src/medicalRecords/medicalRecords.service';
import { getDoctorsOptions } from 'src/medicalRecords/types';

@Controller(DOCTORS_BASE_URL)
export class DoctorsController {
  constructor(
    private readonly doctorService: DoctorService,
    private readonly medicalRecordsService: MedicalRecordsService,
  ) {}

  @Post('scan-qrCode')
  @ValidateQrCode()
  @UseValidation(ScanQrCodeSchema)
  @Doctor()
  @HttpCode(HttpStatus.OK)
  async scanQrCode(
    @getQrNationalId() patientNationalId,
    @getCurrentUser('nationalId') doctorNationalId,
  ) {
    return this.doctorService.scanQrCode(patientNationalId, doctorNationalId);
  }

  @Post('read-medical-records')
  @ValidateQrCode()
  @UseValidation(ScanQrCodeSchema)
  @Doctor()
  @HttpCode(HttpStatus.OK)
  //TODO: don't return all records , make the patient specify a range date in the qr code
  //TODO: filter by action types
  async readMedicalRecords(@getQrPatientId() patientId) {
    return this.medicalRecordsService.getUserMedicalRecords(patientId, {
      doctor: false,
    });
  }

  @Get()
  async getDoctors(@Query() params: getDoctorsOptions) {
    return await this.doctorService.getAllDoctors(params);
  }

  @Get('reviews')
  async getDoctorReviews(@Query('doctorId') doctorId) {
    return await this.doctorService.getDoctorRatings(doctorId);
  }

  @Post('reviews')
  @UseValidation(MakeReviewSchema)
  async makeReview(@getCurrentUser('id') currentUserId, @Body() body) {
    return await this.doctorService.makeReview({
      reviewerId: currentUserId,
      ...body,
    });
  }

  @Get('/:doctorId')
  async getDoctorProfile(@Param('doctorId') doctorId) {
    return this.doctorService.getDoctor(doctorId);
  }
}

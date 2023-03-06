import { Body, Controller, Get } from '@nestjs/common';
import { getCurrentUser, UseValidation } from 'src/common/decorators';
import { MedicalRecords_BASE_URL } from 'src/constants';
import { getMedicalRecordsArgs } from './types';
import { MedicalRecordsService } from './medicalRecords.service';
import { getMedicalRecordsScheam } from './validation-schemas';

@Controller(MedicalRecords_BASE_URL)
export class MedicalRecordsController {
  constructor(private medicalRecordsService: MedicalRecordsService) {}

  @Get()
  @UseValidation(getMedicalRecordsScheam)
  async getAllRecords(
    @getCurrentUser({ field: 'id' }) userId,
    @Body() body: getMedicalRecordsArgs,
  ) {
    return this.medicalRecordsService.getUserMedicalRecords(userId, body);
  }
}

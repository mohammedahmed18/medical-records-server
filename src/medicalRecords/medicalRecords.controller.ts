import { Body, Controller, Get } from '@nestjs/common';
import { getCurrentUser } from 'src/common/decorators';
import { MedicalRecords_BASE_URL } from 'src/constants';
import { getMedicalRecordsArgs } from './types';
import { MedicalRecordsService } from './medicalRecords.service';

@Controller(MedicalRecords_BASE_URL)
export class MedicalRecordsController {
  constructor(private medicalRecordsService: MedicalRecordsService) {}

  @Get()
  async getAllRecords(
    @getCurrentUser('id') userId: string,
    @Body() body: getMedicalRecordsArgs,
  ) {
    return this.medicalRecordsService.getUserMedicalRecords(userId, body);
  }
}

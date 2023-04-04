import { Query, Controller, Get, Post, Body } from '@nestjs/common';
import { Doctor, getCurrentUser, UseValidation } from 'src/common/decorators';
import { MedicalRecords_BASE_URL } from 'src/constants';
import { getMedicalRecordsArgs } from './types';
import { MedicalRecordsService } from './medicalRecords.service';
import { getMedicalRecordsScheam } from './validation-schemas';
import { createMedicalRecordSchema } from 'src/doctors/validation';
import { CreateUserMedicalRecordInput } from 'src/graphql';

@Controller(MedicalRecords_BASE_URL)
export class MedicalRecordsController {
  constructor(private medicalRecordsService: MedicalRecordsService) {}

  @Get()
  @UseValidation(getMedicalRecordsScheam)
  async getAllRecords(
    @getCurrentUser('id') userId,
    @Query() body: getMedicalRecordsArgs,
  ) {
    return this.medicalRecordsService.getUserMedicalRecords(userId, body);
  }

  @Post()
  @UseValidation(createMedicalRecordSchema)
  @Doctor()
  async createMedicalRecord(@getCurrentUser("id") doctorId : string , @Body() data : CreateUserMedicalRecordInput){
    return this.medicalRecordsService.createUserMedicalRecord(doctorId , data);
  }
}

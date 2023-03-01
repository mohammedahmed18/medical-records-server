import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { DOCTOR_SELECT_FIELDS } from './constants';
import { getMedicalRecordsArgs } from './types';

@Injectable()
export class MedicalRecordsService {
  constructor(private prisma: PrismaService) {}

  async getUserMedicalRecords(userId: string, options: getMedicalRecordsArgs) {
    const records = await this.prisma.medical_Record.findMany({
      where: { userId },
      take: options.take,
      skip: options.skip,
      include: {
        doctor: options.doctor ? { select: DOCTOR_SELECT_FIELDS } : false,
      },
    });
    return records;
  }

  // async createUserMedicalRecord(){

  // }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { DOCTOR_SELECT_FIELDS } from './constants';
import { getMedicalRecordsArgs } from './types';

@Injectable()
export class MedicalRecordsService {
  constructor(private prisma: PrismaService) {}

  async getUserMedicalRecords(userId: string, options: getMedicalRecordsArgs) {
    const whereCriteria = { userId };
    if (options.actionType) whereCriteria['actionType'] = options.actionType;
    const records = await this.prisma.medical_Record.findMany({
      where: whereCriteria,
      take: options.take,
      skip: options.skip,
      include: {
        doctor: options.doctor ? { select: DOCTOR_SELECT_FIELDS } : false,
      },
      orderBy: { createdAt: 'desc' },
    });
    return records;
  }

  // async createUserMedicalRecord(){

  // }
}

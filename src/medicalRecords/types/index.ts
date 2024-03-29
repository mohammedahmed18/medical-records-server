import { Prisma } from '@prisma/client';
import { MedicalRecordsActionTypes, MedicalSpecialization } from 'src/graphql';

export type getMedicalRecordsArgs = {
  take?: string; //take and skip will be send through search params so they will be strings
  skip?: string;
  doctor?: string;
  actionType?: keyof typeof MedicalRecordsActionTypes;
};

export type getDoctorsOptions = {
  perPage: string;
  cursor: string;
  q: string;
  medicalSpecialization?: keyof typeof MedicalSpecialization;
  topRated?: Prisma.SortOrder;
  mostReviews?: Prisma.SortOrder;
};

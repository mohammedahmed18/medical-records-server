import { MedicalRecordsActionTypes } from 'src/graphql';

export type getMedicalRecordsArgs = {
  take?: number;
  skip?: number;
  doctor?: boolean;
  actionType?: keyof typeof MedicalRecordsActionTypes;
};

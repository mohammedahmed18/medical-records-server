import { MedicalRecordsActionTypes, MedicalSpecialization } from 'src/graphql';

export type getMedicalRecordsArgs = {
  take?: string; //take and skip will be send through search params so they will be strings
  skip?: string;
  doctor?: boolean;
  actionType?: keyof typeof MedicalRecordsActionTypes;
};


export type getDoctorsOptions = {
  perPage : string
  cursor : string
  search: string
  medicalSpecialization ? : keyof typeof MedicalSpecialization
}

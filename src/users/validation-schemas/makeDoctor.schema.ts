import * as Joi from 'joi';
import { MedicalSpecialization } from 'src/graphql';
import { nationalId_chars } from 'src/constants';

export const makeDoctorSchema = Joi.object({
  nationalId: Joi.string()
    .required()
    .length(nationalId_chars)
    .label('national id'),
  medicalSpecialization: Joi.string()
    .required()
    .valid(...Object.keys(MedicalSpecialization))
    .label('Medical specialization'),
});

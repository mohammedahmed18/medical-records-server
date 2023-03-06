import * as Joi from 'joi';
import { MedicalRecordsActionTypes } from 'src/graphql';

export const getMedicalRecordsScheam = Joi.object({
  take: Joi.number().positive().min(1),
  skip: Joi.number(),
  doctor: Joi.boolean(),
  actionType: Joi.string()
    .valid(...Object.keys(MedicalRecordsActionTypes))
    .label('Medical record type'),
}).label('medical records options');

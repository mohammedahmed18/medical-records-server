import * as Joi from 'joi';
import { MedicalRecordsActionTypes } from 'src/graphql';

const MedicineValidationSchema = Joi.object({
  name: Joi.string().required().label('medicine name'),
  dosesNumber: Joi.number(),
});

const MedicalRecordDetailsValidationSchema = Joi.object({
  medicines: Joi.array().items(MedicineValidationSchema),
});

export const createMedicalRecordScheam = Joi.object({
  title: Joi.string().required().label('Medical record title'),
  userId: Joi.string().required().label('User id'),
  details: MedicalRecordDetailsValidationSchema,
  lifetime: Joi.boolean().default(false),
  actionType: Joi.string()
    .valid(...Object.keys(MedicalRecordsActionTypes))
    .label('Medical record type'),
});

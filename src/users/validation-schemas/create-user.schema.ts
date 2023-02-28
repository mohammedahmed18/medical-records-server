import { loginSchema } from 'src/auth/validation-schemas/login.schema';
import * as Joi from 'joi';

export const createUserSchema = loginSchema.keys({
  name: Joi.string().required(),
  email: Joi.string().email(),
  gender: Joi.string().required().valid('Male', 'Female'),
  dob: Joi.date().required(),
  avg_monthly_income: Joi.number(),
  weight: Joi.string(),
  height_cm: Joi.number(),
  maritalStatusId: Joi.number().required(),
  educationalLevelId: Joi.number().required(),
  employmentStatusId: Joi.number().required(),
});

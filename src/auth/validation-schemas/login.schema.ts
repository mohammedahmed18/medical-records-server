import { nationalId_chars, PASSWORD_MIN_LENGTH } from 'src/constants';
import * as Joi from 'joi';

export const loginSchema = Joi.object({
  nationalId: Joi.string()
    .required()
    .length(nationalId_chars)
    .label('national id'),
  password: Joi.string().min(PASSWORD_MIN_LENGTH).required(),
});

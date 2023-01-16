import { loginSchema } from 'src/auth/validation-schemas/login.schema';
import * as Joi from 'joi';

export const createUserSchema = loginSchema.keys({
  name: Joi.string().required(),
  email: Joi.string().email(),
});

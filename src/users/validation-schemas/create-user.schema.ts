import { loginSchema } from 'src/auth/validation-schemas/login.schema';
import * as Joi from 'joi';

export const createUserSchema = loginSchema.keys({
  name: Joi.string().required(),
  email: Joi.string().email(),
  gender: Joi.string().required().valid("Male" , "Female"),
  dob: Joi.date().required(),

  maritalStatusId : Joi.number().required(),
  educationalLevelId : Joi.number().required(),
  employmentStatusId : Joi.number().required(),
   
    //TODO: add the rest of fields when building the admin page , for now we can edit the database manually 

});

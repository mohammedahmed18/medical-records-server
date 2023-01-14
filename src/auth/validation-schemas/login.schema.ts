import { commons } from 'src/constants';
import * as Joi from "joi";

export const loginSchema = Joi.object({
    nationalId : Joi.string().required().length(commons.nationalId_chars),
    password : Joi.string().min(commons.PASSWORD_MIN_LENGTH).required()
})
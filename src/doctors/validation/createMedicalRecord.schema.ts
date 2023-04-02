import { MedicalRecordsActionTypes } from "@prisma/client";
import * as Joi from "joi";

export const createMedicalRecordSchema = Joi.object({
    userId : Joi.string().required(),
    title : Joi.string().required(),
    lifetime : Joi.boolean().default(false),
    details : Joi.array().items(Joi.object({
        key: Joi.string().required(),
        type: Joi.string().required().valid(...['date' , 'text' , 'list' , 'email' , 'url' , 'phone']),
        value: Joi.string().required()
    })).required(),
    actionType: Joi.string().default(MedicalRecordsActionTypes.Generic).valid(...Object.keys(MedicalRecordsActionTypes))
    .label('Medical record type'),
});

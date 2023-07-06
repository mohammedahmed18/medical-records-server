import * as Joi from 'joi';
import { ModelKeys } from '../aiTests';

export type createAiTestInput = {
  inputData: Record<string, string>;
  modelKey: string;
  userId: string;
};
export const createAiTestSchema = Joi.object({
  inputData: Joi.object(),
  modelKey: Joi.string().valid(...Object.values(ModelKeys)),
  userId: Joi.string().required(),
});

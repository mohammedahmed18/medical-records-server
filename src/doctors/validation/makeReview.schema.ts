import * as Joi from 'joi';

export const MakeReviewSchema = Joi.object({
  doctorId: Joi.string().required(),
  rating: Joi.number().required().max(5),
  comment: Joi.string(),
});

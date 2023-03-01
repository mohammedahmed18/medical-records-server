import { UsePipes } from '@nestjs/common';
import { JoiValidationPipe } from '../pipes';

export const UseValidation = (schema) =>
  UsePipes(new JoiValidationPipe(schema));

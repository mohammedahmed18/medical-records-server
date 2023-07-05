import { Controller, Get } from '@nestjs/common';
import { ML_BASE_URL } from 'src/constants';
import { AiTests } from './aiTests';

@Controller(ML_BASE_URL)
export class TensorflowController {
  @Get('models')
  getAllAiTests() {
    return AiTests.map((test) => {
      delete test.modelPath;
      return test;
    });
  }
}

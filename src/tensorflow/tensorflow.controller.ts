import { Body, Controller, Get, Post } from '@nestjs/common';
import { ML_BASE_URL } from 'src/constants';
import { AiTests } from './aiTests';
import { TensorflowService } from './tensorflow.service';
import { UseValidation, getCurrentUser } from 'src/common/decorators';
import { createAiTestSchema } from './validation';

@Controller(ML_BASE_URL)
export class TensorflowController {
  constructor(private readonly tesorflowService: TensorflowService) {}

  @Get('models')
  getAllAiTests() {
    return AiTests.map((test) => {
      delete test.modelPath;
      return test;
    });
  }

  @Post('test')
  @UseValidation(createAiTestSchema)
  createAiTestRecord(
    @Body() data,
    @getCurrentUser('id') currentUserId: string,
  ) {
    return this.tesorflowService.createAiTestRecord(data, currentUserId);
  }
}

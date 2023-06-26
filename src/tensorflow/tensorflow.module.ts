import { Module } from '@nestjs/common';
import { TensorflowService } from './tensorflow.service';
import { TensorflowController } from './tensorflow.controller';

@Module({
  providers: [TensorflowService],
  controllers: [TensorflowController],
})
export class TensorflowModule {}

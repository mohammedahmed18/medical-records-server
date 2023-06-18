import { Module } from '@nestjs/common';
import { TensorflowService } from './tensorflow.service';

@Module({
  providers: [TensorflowService],
})
export class TensorflowModule {}

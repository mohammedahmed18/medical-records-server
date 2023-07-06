import { Module } from '@nestjs/common';
import { TensorflowService } from './tensorflow.service';
import { TensorflowController } from './tensorflow.controller';
import { PrismaService } from 'src/database/prisma.service';

@Module({
  providers: [TensorflowService, PrismaService],
  controllers: [TensorflowController],
})
export class TensorflowModule {}

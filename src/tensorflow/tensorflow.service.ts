import { Injectable, Logger } from '@nestjs/common';

import {
  LayersModel,
  Tensor,
  loadLayersModel,
  tensor2d,
} from '@tensorflow/tfjs-node';
import { AiTests } from './aiTests';
import { createAiTestInput } from './validation';
import { PrismaService } from 'src/database/prisma.service';

@Injectable()
export class TensorflowService {
  models: Record<string, LayersModel> = {};
  constructor(private readonly prisma: PrismaService) {}

  // private readonly logger = new Logger(TensorflowService.name);

  async onModuleInit() {
    await this.initMlModel();
  }
  async initMlModel() {
    AiTests.forEach(async (model) => {
      this.models[model.modelKey] = await loadLayersModel(
        `file://src/tensorflow/models/${model.modelPath}`,
      );
      Logger.debug(`model "${model.name}" is loaded`);
    });

    // // this should return 0 as prediction
    // const input_data_false = [54, 1, 0, 120, 188, 0, 1, 113, 0, 1.4, 1, 1, 3];

    // // this should return 1 as prediction
    // const input_data_true = [44, 0, 2, 108, 141, 0, 1, 175, 0, 0.6, 1, 0, 2];

    // const input_data_as_tensor_true = tensor2d(input_data_true, [1, 13]);

    // const input_data_as_tensor_false = tensor2d(input_data_false, [1, 13]);

    // const predictionTrue = this.model.predict(input_data_as_tensor_true);
    // const predictionFalse = this.model.predict(input_data_as_tensor_false);

    // console.log({
    //   predictionFalse: (predictionFalse as Tensor).dataSync()[0],
    //   predictionTrue: (predictionTrue as Tensor).dataSync()[0],
    // });
  }

  async createAiTestRecord(data: createAiTestInput, currentUserId: string) {
    //
    const { modelKey, inputData, userId } = data;

    const finalInputData = [];

    const model = AiTests.find((m) => m.modelKey == modelKey);

    model.attributes.forEach((attribute) => {
      const attributeValue = inputData[attribute.label];
      finalInputData.push(attributeValue);
    });

    const input_data_as_tensor = tensor2d(finalInputData, [
      1,
      model.attributes.length,
    ]);

    const prediction = this.models[modelKey].predict(input_data_as_tensor);

    const predictionValue = (prediction as Tensor).dataSync()[0];

    const hasDisease = predictionValue !== 0 ? true : false;

    // generate medical record
    // return hasDisease;

    const details = [];

    details.push({
      type: 'text',
      key: 'Test Result',
      value: hasDisease ? 'Positive' : 'Negative',
    });

    Object.keys(inputData).forEach((inputDataKey) => {
      details.push({
        type: 'text',
        key: inputDataKey,
        value: inputData[inputDataKey],
      });
    });

    const aiTestRecord = await this.prisma.medical_Record.create({
      data: {
        title: model.name,
        actionType: 'AI_TEST',
        details,
        userId: userId,
        doctorId: currentUserId,
      },
    });

    return aiTestRecord;
  }
}

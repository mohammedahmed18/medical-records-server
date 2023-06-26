import { Injectable, Logger } from '@nestjs/common';

import {
  LayersModel,
  // Tensor,
  loadLayersModel,
  // tensor2d,
} from '@tensorflow/tfjs-node';
import { AiTests } from './aiTests';

@Injectable()
export class TensorflowService {
  models: Record<string, LayersModel> = {};

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
}

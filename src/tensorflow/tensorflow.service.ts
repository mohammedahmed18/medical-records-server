import { Injectable, Logger } from '@nestjs/common';

import { LayersModel, loadLayersModel } from '@tensorflow/tfjs-node';
export const importDynamic = new Function(
  'modulePath',
  'return import(modulePath)',
);

@Injectable()
export class TensorflowService {
  model: LayersModel;

  private readonly logger = new Logger(TensorflowService.name);

  async onModuleInit() {
    await this.initMlModel();
  }
  async initMlModel() {
    this.model = await loadLayersModel(
      'file://src/tensorflow/models/model.json',
    );
    Logger.debug('Machine learning model is loaded');
  }
}

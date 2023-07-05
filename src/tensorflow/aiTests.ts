export const ModelKeys = {
  HeartDisease: 'M__1',
};

export type ModelAttributeInputType = 'text' | 'number' | 'select';

export type ModelAttribute = {
  label: string;
  comment?: string;
  selectOptions?: { label: string; value: string | number }[];
  type: ModelAttributeInputType;
  min?: number;
  max?: number;
};

export type MlModel = {
  name: string;
  modelKey: string;
  modelPath: string;
  attributes: ModelAttribute[];
};

export const AiTests: MlModel[] = [
  // TODO: add icon for each ai model
  {
    name: 'Heart Disease Test',
    modelKey: ModelKeys.HeartDisease,
    modelPath: 'heart-disease/model.json',
    attributes: [
      {
        label: 'age',
        type: 'number',
        min: 29,
        max: 77,
      },
      {
        label: 'sex',
        type: 'select',
        selectOptions: [
          { label: 'Male', value: 1 },
          { label: 'Female', value: 0 },
        ],
      },
      {
        label: 'chest pain',
        type: 'select',
        selectOptions: [
          { label: 'Level 1', value: 0 },
          { label: 'Level 2', value: 1 },
          { label: 'Level 3', value: 2 },
          { label: 'Level 4', value: 3 },
        ],
      },
      {
        label: 'resting blood pressure',
        type: 'number',
        min: 94,
        max: 200,
      },
      {
        label: 'serum cholestoral in mg/dl',
        type: 'number',
        min: 126,
        max: 564,
      },
      {
        label: 'fasting blood sugar > 120 mg/dl',
        type: 'select',
        selectOptions: [
          { label: 'Yes', value: 1 },
          { label: 'No', value: 0 },
        ],
      },
      {
        label: 'resting electrocardiographic results',
        type: 'select',
        selectOptions: [
          { label: 'None', value: 0 },
          { label: '1', value: 1 },
          { label: '2', value: 2 },
        ],
      },
      {
        label: 'maximum heart rate achieved',
        type: 'number',
        min: 71,
        max: 202,
      },
      {
        label: 'exercise induced angina',
        type: 'select',
        selectOptions: [
          { label: 'Yes', value: 1 },
          { label: 'No', value: 0 },
        ],
      },
      {
        label: 'oldpeak = ST depression induced by exercise relative to rest',
        type: 'number',
        min: 0,
        max: 6.2,
      },
      {
        label: 'the slope of the peak exercise ST segment',
        type: 'select',
        selectOptions: [
          { label: 'None', value: 0 },
          { label: '1', value: 1 },
          { label: '2', value: 2 },
        ],
      },
      {
        label: 'number of major vessels (0-3) colored by flourosopy',
        type: 'select',
        selectOptions: [
          { label: 'None', value: 0 },
          { label: '1', value: 1 },
          { label: '2', value: 2 },
          { label: '3', value: 3 },
        ],
      },
      {
        label: 'thal',
        type: 'select',
        selectOptions: [
          { label: 'Normal', value: 1 },
          { label: 'fixed defect', value: 2 },
          { label: 'eversable defect', value: 3 },
        ],
      },
    ],
  },
];

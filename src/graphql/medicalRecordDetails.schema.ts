import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class MedicalRecordDetails {
  @Field(() => [MedicineType], { nullable: true })
  medicines?: MedicineType[];
}

// @InputType()
class BaseDetailType {}

@InputType()
class MedicineType extends BaseDetailType {
  @Field()
  name: string;

  @Field(() => Int)
  dosesNumber: number;
}

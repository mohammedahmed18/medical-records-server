import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MedicalRecordDetail {
  @Field()
  key: string;

  @Field()
  type: string;


  @Field()
  value: string; // value should be always string ,even if it's an array it should be stringified

}

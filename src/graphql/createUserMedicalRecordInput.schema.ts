import { Field, InputType } from '@nestjs/graphql';
import { MedicalRecordsActionTypes } from './enums.schema';
import { MedicalRecordDetails } from './medicalRecordDetails.schema';

@InputType()
export class CreateUserMedicalRecordInput {
  @Field()
  title: string;

  @Field()
  userId: string;

  @Field(() => MedicalRecordDetails)
  details: MedicalRecordDetails;

  @Field({ nullable: true })
  doctorId?: string;

  @Field(() => Boolean, { nullable: true }) // it's default to false in prisma schema
  lifetime?: boolean;

  @Field(() => MedicalRecordsActionTypes, { nullable: true }) // it's default to GENERIC in prisma schema
  actionType?: MedicalRecordsActionTypes;
}

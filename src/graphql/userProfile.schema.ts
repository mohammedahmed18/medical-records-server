import { MedicalSpecialization } from 'src/graphql';
import { Field, Float, ObjectType } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime/library';
import { Gender } from './enums.schema';

@ObjectType()
export class UserProfile {
  @Field()
  id: string;

  @Field()
  nationalId: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  email?: string;

  @Field(() => Gender)
  gender: keyof typeof Gender;

  @Field(() => Date)
  dob: Date;

  @Field(() => Float, { nullable: true })
  avg_monthly_income: number;

  @Field({ nullable: true })
  weight: string;

  @Field(() => Float, { nullable: true })
  height_cm: Decimal;

  @Field(() => String, { nullable: true })
  image_src: string;

  @Field()
  employmentStatus?: string;

  @Field()
  maritalStatus?: string;

  @Field()
  educationalLevel?: string;

  @Field(() => MedicalSpecialization, { nullable: true })
  medicalSpecialization?: keyof typeof MedicalSpecialization;
}

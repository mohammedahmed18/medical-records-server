import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { Gender, MedicalSpecialization } from './enums.schema';

@InputType()
export class CreateUserInput {
  @Field()
  nationalId: string;
  @Field()
  name: string;
  @Field({ nullable: true })
  email?: string | null;

  @Field()
  password: string;

  @Field(() => Gender)
  gender: Gender;

  @Field(() => Date)
  dob: Date | string;

  @Field(() => Float, { nullable: true })
  avg_monthly_income?: number | null;

  @Field({ nullable: true }) //FIXME: why weight is string in prisma schema
  weight?: string | null;

  @Field(() => Float, { nullable: true })
  height_cm?: number | null;

  @Field(() => MedicalSpecialization, { nullable: true })
  medicalSpecialization?: keyof typeof MedicalSpecialization;

  // image_src?: string
  @Field(() => Int)
  maritalStatusId: number;
  @Field(() => Int)
  educationalLevelId: number;
  @Field(() => Int)
  employmentStatusId: number;
}

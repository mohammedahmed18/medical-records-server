import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import { Decimal } from '@prisma/client/runtime/library';
import { Gender, MedicalSpecialization } from './enums.schema';
import { UserProfile } from './userProfile.schema';

enum UserDetails {
  employmentStatus,
  maritalStatus,
  educationalLevel,
}

@ObjectType()
export class UserDetail {
  @Field({ nullable: true })
  label?: string;
}

export type UserProfileWithoutDetails = Omit<
  UserProfile,
  keyof typeof UserDetails
>;
@ObjectType()
export class User implements UserProfileWithoutDetails {
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
  password: string;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  @Field({ nullable: true })
  hashedRt: string | null;

  @Field(() => Int)
  maritalStatusId: number;
  @Field(() => Int)
  educationalLevelId: number;
  @Field(() => Int)
  employmentStatusId: number;

  @Field(() => UserDetail, { nullable: true })
  maritalStatus?: UserDetail;
  @Field(() => UserDetail, { nullable: true })
  educationalLevel?: UserDetail;
  @Field(() => UserDetail, { nullable: true })
  employmentStatus?: UserDetail;

  @Field(() => MedicalSpecialization, { nullable: true })
  medicalSpecialization?: keyof typeof MedicalSpecialization;
}

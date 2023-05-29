import { Field, Float, InputType } from '@nestjs/graphql';

@InputType()
export class CreateReviewInput {
  @Field()
  doctorId: string;

  @Field()
  reviewerId: string;

  @Field(() => Float)
  rating: number;

  @Field({ nullable: true })
  comment?: string;
}

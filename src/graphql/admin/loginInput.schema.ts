import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class LoginInputType {
  @Field()
  username: string;

  @Field()
  password: string;
}

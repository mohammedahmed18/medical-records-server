import { Field, InputType } from '@nestjs/graphql';
import { MessageKinds } from '../enums.schema';

@InputType()
export class CreateMessageInputType {
  @Field(() => MessageKinds, { nullable: true })
  type?: MessageKinds;

  @Field()
  value: string;

  @Field()
  toId: string;
}

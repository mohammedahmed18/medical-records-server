import { Field, ObjectType } from '@nestjs/graphql';
import { MessageKinds } from '../enums.schema';
import { RoomUserType } from './room.schema';

@ObjectType()
export class MessageType {
  @Field()
  id: string;

  @Field()
  senderId: string;

  @Field()
  roomId: string;

  @Field(() => MessageKinds)
  type: MessageKinds;

  @Field()
  value: string;

  @Field(() => Date)
  createdAt: string;
}

@ObjectType()
export class MessageSentType extends MessageType {
  @Field()
  to: string;

  @Field(() => RoomUserType)
  sentUser: RoomUserType;
}

@ObjectType()
export class LastMessageType extends MessageType {
  @Field(() => Boolean)
  isMe: boolean;
}

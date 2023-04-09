import { Field, ObjectType } from "@nestjs/graphql";
import { MessageKinds } from "../enums.schema";

@ObjectType()
export class MessageType {
    @Field()
    id : string

    @Field()
    senderId : string

    @Field()
    roomId : string

    @Field(() => MessageKinds)
    type  : MessageKinds

    @Field()
    value : string
}
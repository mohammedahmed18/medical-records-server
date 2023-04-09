import { Field, ObjectType } from "@nestjs/graphql"
import { MessageType } from "./message.schema"



@ObjectType()
class RoomUserType {
    @Field()
    id : string
  
    @Field()
    name : string

    @Field({nullable : true})
    image_src? : string
}


@ObjectType()
export class RoomType {
    @Field()
    id : string

    @Field(() => MessageType)
    lastMessage : MessageType

    @Field(() => RoomUserType)
    otherUser : RoomUserType

    @Field() //test
    lastMessageTimestamp : string

}



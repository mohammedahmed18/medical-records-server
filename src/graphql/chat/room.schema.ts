import { Field, ObjectType } from "@nestjs/graphql"
import { LastMessageType } from "./message.schema"



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

    @Field(() => LastMessageType)
    lastMessage : LastMessageType

    @Field(() => RoomUserType)
    otherUser : RoomUserType

    @Field() //test
    lastMessageTimestamp : string

}

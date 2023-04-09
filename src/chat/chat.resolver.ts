import { Args, Mutation, Query, Resolver, Subscription } from "@nestjs/graphql";
import { getCurrentUser } from "src/common/decorators";
import { ChatService } from "./chat.service";
import { CreateMessageInputType, MessageType, RoomType } from "src/graphql";
import { PubSub } from "graphql-subscriptions";
import { MESSAGE_SENT } from "src/constants";



@Resolver()
export class ChatResolver{
    private pubSub : PubSub;

    constructor(private readonly chatService : ChatService){
        this.pubSub = new PubSub()
    }

    @Query(() => [RoomType])
    async getMyRooms(@getCurrentUser("id") currentUserId : string){
        return this.chatService.getUserRoomsForClient(currentUserId);
    }

    @Mutation(() => MessageType)
    async sendMessage(@getCurrentUser("id") currentUserId : string , @Args("data") createMessageInput : CreateMessageInputType){
        return this.chatService.sendMessage(currentUserId, createMessageInput, this.pubSub);
    }

    // later wa can have a message queue instead like rabbitMQ
    @Subscription(() => MessageType,{
        name : MESSAGE_SENT,
        filter: (message : MessageType & {to : string}, _ , context) => {
            const {id : currentUserId} = context.req.user
            return currentUserId === message.to
        },
        resolve: (payload) => payload
    })
    async messageSend(){
        return this.pubSub.asyncIterator(MESSAGE_SENT);
    }
}
import { Args, Mutation, Query, Resolver } from "@nestjs/graphql";
import { getCurrentUser } from "src/common/decorators";
import { ChatService } from "./chat.service";
import { CreateMessageInputType, MessageType, RoomType } from "src/graphql";
import {PubSub} from 'graphql-subscriptions'

const pubSub = new PubSub();


@Resolver()
export class ChatResolver{

    constructor(private readonly chatService : ChatService){}

    @Query(() => [RoomType])
    async getMyRooms(@getCurrentUser("id") currentUserId : string){
        return this.chatService.getUserRoomsForClient(currentUserId);
    }

    @Mutation(() => MessageType)
    async sendMessage(@getCurrentUser("id") currentUserId : string , @Args("data") createMessageInput : CreateMessageInputType){
        return this.chatService.sendMessage(currentUserId, createMessageInput);
    }
}
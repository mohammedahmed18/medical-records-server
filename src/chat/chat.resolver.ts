import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { Public, getCurrentUser } from 'src/common/decorators';
import { ChatService } from './chat.service';
import {
  CreateMessageInputType,
  MessageSentType,
  MessageType,
  RoomType,
} from 'src/graphql';
import { PubSub } from 'graphql-subscriptions';
import { MESSAGE_SENT } from 'src/constants';

@Resolver()
export class ChatResolver {
  private pubSub: PubSub;

  constructor(private readonly chatService: ChatService) {
    this.pubSub = new PubSub();
  }

  @Query(() => [RoomType])
  async getMyRooms(@getCurrentUser('id') currentUserId: string) {
    return this.chatService.getUserRoomsForClient(currentUserId);
  }

  // @Query(() => [MessageType])
  // async getRoomMessages(@getCurrentUser("id") currentUserId : string, @Args("roomId") roomId : string){
  //     return this.chatService.getRoomMessages(currentUserId , roomId)
  // }

  @Mutation(() => MessageSentType)
  async sendMessage(
    @getCurrentUser() currentUser,
    @Args('data') createMessageInput: CreateMessageInputType,
  ): Promise<MessageSentType> {
    return this.chatService.sendMessage(
      currentUser,
      createMessageInput,
      this.pubSub,
    );
  }

  // later we can have a message queue (message broker) instead like rabbitMQ or nats
  @Subscription(() => MessageSentType, {
    name: MESSAGE_SENT,

    filter: (message: MessageSentType, _, context) => {
      const { id: currentUserId } = context.req.user;
      const isPrivate = message.to === message.senderId;
      if (isPrivate) return false;
      return currentUserId === message.to;
    },
    resolve: (payload) => payload,
  })
  async messageSend() {
    return this.pubSub.asyncIterator(MESSAGE_SENT);
  }
}

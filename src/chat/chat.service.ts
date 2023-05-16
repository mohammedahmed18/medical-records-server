import { PubSub } from 'graphql-subscriptions';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateMessageInputType } from 'src/graphql';
import { UsersService } from 'src/users/users.service';
import { resizeCloudinaryImage } from 'src/utils/resizeCloudinaryImage';
import { MESSAGE_SENT } from 'src/constants';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
  ) {
  }


  private async getUserRooms(userId){
    return this.prisma.room.findMany({
        where: {
          users: { array_contains: userId },
        },
        orderBy: { lastMessageTimestamp: 'desc' },
        select: {
          id: true,
          lastMessage: true,
          users: true,
          lastMessageTimestamp: true,
        },
      });
  }
  // TODO: pagination
  async getUserRoomsForClient(userId) {
    const rooms = await this.getUserRooms(userId)

    const roomsWithOtherUsers = await Promise.all(
      rooms.map(async (room) => {
        const roomUsers = room.users as Prisma.JsonArray;
        delete room.users;
        
        const privateChat = roomUsers[0] === roomUsers[1]

        const otherUserId = privateChat ? userId : roomUsers.find((id) => userId !== id);
        const user = await this.userService.findById(otherUserId.toString(), {
          id: true,
          image_src: true,
          name: true,
        });

        if(room.lastMessage)
          room.lastMessage["isMe"] = userId === room.lastMessage?.senderId

        return {
          ...room,
          otherUser: {
            ...user,
            image_src: resizeCloudinaryImage(user?.image_src, { size: 300, square: true }),
          },
        };
      }),
    );

    return roomsWithOtherUsers;
  }

  private async createRoom(...userIds) {
    const room = await this.prisma.room.create({
      data: {
        users: [...userIds],
      },
      include: {
        messages: true
      }
    });

    return room;
  }

  private async upadeRoomLastMessage(roomId, lastMessageId) {
    await this.prisma.room.update({
      where: { id: roomId },
      data: {
        lastMessageTimestamp: new Date(),
        lastMessageId,
      },
    });
  }

  // private room will have two of the same user id in users array
  // so that our code doesn't break
  async getPrivateRoom(userId , withMessages= false){
    let privateRoom = await this.prisma.room.findFirst({
      where: { users: { equals: [userId , userId] } },
      include : withMessages ? {messages : {
              // TODO: make orderby desc & pagination 
              orderBy : { createdAt : "asc" },
              // take : 10 
            }} : null,
    });
    if(!privateRoom){
      // create the room if not exist
      privateRoom = await this.createRoom(userId , userId)
    }
    return privateRoom;
  }
  async getRoomWithOtherUser(currentUserId: string , otherUserId: string, withMessages = false){
    return await this.prisma.room.findFirst({
      where: { users: { array_contains: [currentUserId, otherUserId] } },
      include : withMessages ? {messages : {
              // TODO: make orderby desc & pagination 
              orderBy : { createdAt : "asc" },
              // take : 10 
            }} : null,
    });
  }
  async sendMessage(currentUserId: string , createMessageInput : CreateMessageInputType, pubSub: PubSub) {

    const {toId , type ,value} = createMessageInput
    const isPrivate = currentUserId === toId
    let room = isPrivate ? await this.getPrivateRoom(currentUserId) : await this.getRoomWithOtherUser(currentUserId , toId)

    if (!room) {
      const createdRoom = await this.createRoom(
        toId,
        currentUserId,
      );
      room = createdRoom;
    }
    const message = await this.prisma.message.create({
      data: {
        senderId: currentUserId,
        roomId: room.id,
        type: type || "text",
        value,
      },
      select: {
        id: true,
        senderId: true,
        roomId: true,
        type: true,
        value: true,
      },
    });
    // this will help us filter the subscriptions based on the reciever id
    message['to'] = toId

    this.upadeRoomLastMessage(room.id, message.id);

    pubSub.publish(MESSAGE_SENT , message)
    return message;
  } 

  async getRoomMessages(currentUserId:string ,otherUserId : string){
    if(currentUserId === otherUserId) {
      // get my private chat
      const myPrivateRoom = await this.getPrivateRoom(currentUserId, true);
      
      return myPrivateRoom?.messages || []
    }
    const room = await this.getRoomWithOtherUser(currentUserId, otherUserId , true)
    if(!room) return [] //if theres is no previous messages return empty array
   
    return room.messages.map(message => {
      const isMe = message.senderId === currentUserId
      return {...message , isMe}
    })

    // get the room
    // const room = await this.prisma.room.findFirst(
    //   {
    //     where : {id : roomId},
    //     include : {messages : {
    //       // TODO: make orderby desc & pagination 
    //       orderBy : { createdAt : "asc" },
    //       // take : 10 
    //     }},
    //   }
    //   );
  
    // // make sure the current user exists in this room
    //  const users = room.users as Prisma.JsonArray

    // if(! users.includes(currentUserId))
    //   throw new ForbiddenException("you can't access this room")
  
    // // get room messages
    // return room.messages
    }
}

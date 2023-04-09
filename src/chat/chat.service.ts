import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import { CreateMessageInputType } from 'src/graphql';
import { UsersService } from 'src/users/users.service';
import { resizeCloudinaryImage } from 'src/utils/resizeCloudinaryImage';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
  ) {}


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
  async getUserRoomsForClient(userId) {
    const rooms = await this.getUserRooms(userId)

    const roomsWithOtherUsers = await Promise.all(
      rooms.map(async (room) => {
        const roomUsers = room.users as Prisma.JsonArray;
        const otherUserId = roomUsers.find((id) => userId !== id);
        const user = await this.userService.findById(otherUserId.toString(), {
          id: true,
          image_src: true,
          name: true,
        });

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

  private async createRoom(otherUserId, currentUserId) {
    const room = await this.prisma.room.create({
      data: {
        users: [otherUserId, currentUserId],
      },
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

  async sendMessage(currentUserId: string , createMessageInput : CreateMessageInputType) {

    const {toId , type ,value} = createMessageInput
    let room = await this.prisma.room.findFirst({
      where: { users: { array_contains: [currentUserId, toId] } },
    });

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

    this.upadeRoomLastMessage(room.id, message.id);
    

    return message;
  }

  
}
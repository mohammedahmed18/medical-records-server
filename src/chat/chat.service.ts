import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/database/prisma.service';
import {
  CreateMessageInputType,
  MessageKinds,
  MessageSentType,
} from 'src/graphql';
import { UsersService } from 'src/users/users.service';
import { squarizeImage } from 'src/utils/resizeCloudinaryImage';
import {
  BASE_IMAGE_SIZE,
  CHAT_USER_NOT_FOUND,
  MESSAGE_SENT,
} from 'src/constants';
import { CustomError } from 'src/common/errors';

@Injectable()
export class ChatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UsersService,
  ) {}

  private async getUserRooms(userId) {
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
  async deleteRoom(roomId: string) {
    const roomDelete = this.prisma.room.delete({
      where: {
        id: roomId,
      },
    });

    const messagesDelete = this.prisma.message.deleteMany({
      where: {
        roomId,
      },
    });

    // should delete the messages first before the room
    return await this.prisma.$transaction([messagesDelete, roomDelete]);
  }

  // TODO: pagination
  async getUserRoomsForClient(userId) {
    const rooms = await this.getUserRooms(userId);

    const roomsWithOtherUsers = await Promise.all(
      rooms.map(async (room) => {
        const roomUsers = room.users as Prisma.JsonArray;
        delete room.users;

        const privateChat = roomUsers[0] === roomUsers[1];

        const otherUserId = privateChat
          ? userId
          : roomUsers.find((id) => userId !== id);

        const otherUser = await this.userService.findById(
          otherUserId.toString(),
          {
            id: true,
            image_src: true,
            name: true,
          },
        );

        if (!otherUser) {
          // this is a bug as we store the ids of the users in the romm users array
          // as json in no-sql way , so if the message is sent to id that doesn't exist it will return other user as null
          // to encounter this we will return null so it gets removed from the response and delete the room in another thread

          this.deleteRoom(room.id);
          return null;
        }
        if (room.lastMessage)
          room.lastMessage['isMe'] = userId === room.lastMessage?.senderId;

        return {
          ...room,
          isPrivate: privateChat,
          otherUser: {
            ...otherUser,
            image_src: squarizeImage(otherUser.image_src, BASE_IMAGE_SIZE),
          },
        };
      }),
    );
    return roomsWithOtherUsers.filter((r) => r !== null);
  }

  private async createRoom(...userIds) {
    const room = await this.prisma.room.create({
      data: {
        users: [...userIds],
      },
      include: {
        messages: true,
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

  // private room will have two of the same user id in users array
  // so that our code doesn't break
  // TODO: remove any usage of this as it's used in getRoomWithOtherUser method
  async getPrivateRoom(userId, withMessages = false, createRoom = true) {
    let privateRoom = await this.prisma.room.findFirst({
      where: { users: { equals: [userId, userId] } },
      include: withMessages
        ? {
            messages: {
              // TODO: make orderby desc & pagination
              orderBy: { createdAt: 'asc' },
              // take : 10
            },
          }
        : null,
    });
    if (!privateRoom && createRoom) {
      // create the room if not exist
      privateRoom = await this.createRoom(userId, userId);
    }
    return privateRoom;
  }
  async getRoomWithOtherUser(
    currentUserId: string,
    otherUserId: string,
    withMessages = false,
    createRoom = true,
  ) {
    if (currentUserId === otherUserId) {
      //private room
      return await this.getPrivateRoom(currentUserId, withMessages, createRoom);
    }
    let room = await this.prisma.room.findFirst({
      where: { users: { array_contains: [currentUserId, otherUserId] } },
      include: withMessages
        ? {
            messages: {
              // TODO: make orderby desc & pagination
              orderBy: { createdAt: 'asc' },
              // take : 10
            },
          }
        : null,
    });

    if (!room && createRoom) {
      const createdRoom = await this.createRoom(otherUserId, currentUserId);
      room = createdRoom;
    }

    return room;
  }
  async sendMessage(
    currentUser,
    createMessageInput: CreateMessageInputType,
    pubSub,
  ): Promise<MessageSentType> {
    const { toId, type, value } = createMessageInput;
    const { id, name, image_src } = currentUser;
    const isPrivate = id === toId;

    const room = isPrivate
      ? await this.getPrivateRoom(id)
      : await this.getRoomWithOtherUser(id, toId);

    const message = await this.prisma.message.create({
      data: {
        senderId: id,
        roomId: room.id,
        type: type || 'text',
        value,
      },
      select: {
        id: true,
        senderId: true,
        roomId: true,
        type: true,
        value: true,
        createdAt: true,
      },
    });

    this.upadeRoomLastMessage(room.id, message.id);

    const sentMessage = {
      ...message,
      type: MessageKinds[message.type],
      createdAt: message.createdAt.toString(),
      to: toId, // this will help us filter the subscriptions based on the reciever id
      sentUser: {
        id,
        name,
        image_src: squarizeImage(image_src, BASE_IMAGE_SIZE),
      },
    };

    if (!isPrivate) pubSub.publish(MESSAGE_SENT, sentMessage);

    return sentMessage;
  }

  async getRoomMessages(currentUserId: string, otherUserId: string) {
    const otherUser = await this.userService.findById(otherUserId, {
      id: true,
      name: true,
      image_src: true,
      medicalSpecialization: true,
    });
    if (!otherUser)
      throw new CustomError({
        message: 'user not found',
        errorCode: CHAT_USER_NOT_FOUND,
        statusCode: 404,
      });
    if (currentUserId === otherUserId) {
      // get my private chat
      const myPrivateRoom = await this.getPrivateRoom(
        currentUserId,
        true,
        false,
      );

      const messages = myPrivateRoom?.messages || [];
      return {
        isPrivateChat: true,
        otherUser: {
          ...otherUser,
          image_src: squarizeImage(otherUser.image_src, BASE_IMAGE_SIZE),
        },
        messages: messages.map((m) => ({ ...m, isMe: true })), //isMe will always be true in private chat
      };
    }

    const room = await this.getRoomWithOtherUser(
      currentUserId,
      otherUserId,
      true,
      false,
    );

    return {
      isPrivateChat: false,
      otherUser: {
        ...otherUser,
        image_src: squarizeImage(otherUser.image_src, BASE_IMAGE_SIZE),
      },
      messages: room
        ? room.messages.map((message) => {
            const isMe = message.senderId === currentUserId;
            return { ...message, isMe };
          })
        : [],
    };
  }
  // FIXME: dev only
  async clearChat(currentUserId: string, otherUserId: string) {
    const { id: roomId } = await this.getRoomWithOtherUser(
      currentUserId,
      otherUserId,
    );
    await this.deleteRoom(roomId);
    return true;
  }
}

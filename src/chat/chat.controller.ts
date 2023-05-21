import { Body, Controller, Delete, Get, Param } from "@nestjs/common";
import { getCurrentUser } from "src/common/decorators";
import { CHAT_BASE_URL } from "src/constants";
import { ChatService } from "./chat.service";


@Controller(CHAT_BASE_URL)
export class ChatController{

    constructor(private readonly chatService : ChatService){}

    @Get("rooms")
    async getMyRooms(@getCurrentUser("id") currentUserId : string){
        return this.chatService.getUserRoomsForClient(currentUserId);
    }

    @Get("/room-messages/:userId")
    async getRoomMessages(@Param("userId") otherUserId, @getCurrentUser("id") currentUserId : string){
        return this.chatService.getRoomMessages(currentUserId, otherUserId);
    }
    @Delete("clear-chat")
    async clearChat(@getCurrentUser("id") currentUserId : string , @Body("userId") otherUserId){
        //
        return this.chatService.clearChat(currentUserId, otherUserId);

    }
}
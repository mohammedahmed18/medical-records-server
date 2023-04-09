import { Module } from "@nestjs/common";
import { ChatResolver } from "./chat.resolver";
import { ChatService } from "./chat.service";
import { DatabaseModule } from "src/database/database.module";
import { UsersModule } from "src/users/users.module";
import { ChatController } from "./chat.controller";



@Module({
    controllers: [ChatController],
    imports : [DatabaseModule , UsersModule],
    providers: [ChatResolver, ChatService]
})
export class ChatModule{}
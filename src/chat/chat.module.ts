import { Module } from "@nestjs/common";
import { ChatResolver } from "./chat.resolver";
import { ChatService } from "./chat.service";
import { DatabaseModule } from "src/database/database.module";
import { UsersModule } from "src/users/users.module";



@Module({
    imports : [DatabaseModule , UsersModule],
    providers: [ChatResolver, ChatService]
})
export class ChatModule{}
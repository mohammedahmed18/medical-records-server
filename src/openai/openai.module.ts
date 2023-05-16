import { Module } from "@nestjs/common";
import { OpenAIService } from "./openai.service";

@Module({
    providers:[OpenAIService]
})
export class OpenAIModule{

}
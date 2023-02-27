import { ObjectType } from "@nestjs/graphql";
import { User } from "./user.schema";

@ObjectType()
export class UserProfile extends User{

    
}
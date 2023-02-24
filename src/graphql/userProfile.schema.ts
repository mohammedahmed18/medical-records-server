import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class UserProfile{
    @Field()
    id: string;

    @Field()
    nationalId : string;

    
}
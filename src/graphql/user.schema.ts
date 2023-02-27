import { Field, Float, ObjectType } from "@nestjs/graphql";
import { Gender } from "./enums.schema";

@ObjectType()
export class User{
    @Field()
    id: string;

    @Field()
    nationalId : string;

    @Field()
    name: string;

    @Field({nullable : true})
    email?: string;
    
    @Field(() => Gender)
    gender: Gender

    @Field(() => Date)
    dob: Date

    @Field(() => Float ,{nullable : true})
    avg_monthly_income: number

  
    @Field(() => Float ,{nullable : true})
    weight: number

    @Field(() => Float ,{nullable : true})
    height_cm: number

    @Field(() => String ,{nullable : true})
    image_src: string;


    @Field()
    employmentStatus: string;
   
    @Field()
    maritalStatus: string;

    @Field()
    educationalLevel: string;
    
}
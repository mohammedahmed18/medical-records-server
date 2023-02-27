import { Logger, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext, registerEnumType } from '@nestjs/graphql';
import { Gender } from 'src/graphql';

type regiteredEnum<T>={
    enum: T,
    name: string,
    description?: string
}
export class GraphQlUtils{
    
   private static enums: regiteredEnum<unknown>[] = [
        {
            enum : Gender,
            name: "Gender",
            description: null
        },
    ]
    
   static registerEnumTypes = () => {
        GraphQlUtils.enums.forEach(e => {
            typeof e.enum === "object" && registerEnumType(e.enum , {name : e.name , description: e.description})
            Logger.debug(`Graphql: regitered enum type : ${e.name}`)
        })
    }
    static isGraphQl(context: ExecutionContext): boolean{
        return GqlExecutionContext.create(context).getType() === "graphql";
    }
    static getGraphQlContextParams(context: ExecutionContext){
        const ctx = GqlExecutionContext.create(context);
        const { req } = ctx.getContext();
        
        return {req , args : ctx.getArgs()};
    }
}

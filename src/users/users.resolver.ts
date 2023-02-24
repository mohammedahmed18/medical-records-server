import { Resolver, Query } from '@nestjs/graphql';
import { Public } from 'src/common/decorators';
import { User } from 'src/graphql';

@Resolver(() => User)
export class UserResolver {
  @Query(() => String)
  @Public()
  sayHello(): string {
    return 'graphql is working';
  }
  
  @Query(() => String)
  protectedRoute(): string {
    return 'this is protected';
  }
  
}

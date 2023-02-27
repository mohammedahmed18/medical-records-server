import { UserProfile } from './../graphql/userProfile.schema';
import { UsersService } from './users.service';
import { Resolver, Query } from '@nestjs/graphql';
import { getCurrentUser, Public } from 'src/common/decorators';
import { User } from 'src/graphql';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UsersService){}
  @Query(() => [User])
  @Public()
  async users(){
    const users = await this.userService.getAll();
    return users;
  }

  @Query(() => UserProfile)
  async me(@getCurrentUser("id") userId: string){
    return await this.userService.loggedInUserProfile(userId)
  }
  
}

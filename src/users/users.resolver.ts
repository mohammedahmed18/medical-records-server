import { UserProfile } from './../graphql/userProfile.schema';
import { UsersService } from './users.service';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { getCurrentUser, Public, UseValidation } from 'src/common/decorators';
import { CreateUserInput } from 'src/graphql';
import { createUserSchema } from './validation-schemas';

@Resolver(() => UserProfile)
export class UserResolver {
  constructor(private userService: UsersService) {}
  @Query(() => [UserProfile])
  @Public()
  async users() {
    const users = await this.userService.getAll();
    return users;
  }

  @Query(() => UserProfile)
  async me(@getCurrentUser('id') userId: string) {
    return await this.userService.loggedInUserProfile(userId);
  }

  @Mutation(() => String)
  @UseValidation(createUserSchema)
  @Public()
  async createUser(@Args('data') CreateUserInput: CreateUserInput) {
    return await this.userService.createUser(CreateUserInput);
  }
}

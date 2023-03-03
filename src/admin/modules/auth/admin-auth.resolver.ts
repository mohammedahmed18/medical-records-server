import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Public } from 'src/common/decorators';
import {
  AdminType,
  LoginInputType,
  LoginResponseType,
} from 'src/graphql/admin';
import { AdminAuthService } from './admin-auth.service';

@Resolver(() => AdminType)
export class AdminAuthResolver {
  constructor(private adminAuthService: AdminAuthService) {}

  @Mutation(() => LoginResponseType)
  @Public()
  async adminLogin(
    @Args('credentials') credentials: LoginInputType,
  ): Promise<LoginResponseType | null> {
    const accessToken = await this.adminAuthService.login(credentials);
    return { accessToken };
  }
}

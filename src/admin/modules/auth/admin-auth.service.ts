import { AdminService } from './../../admin.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { LoginInputType } from 'src/graphql/admin';
import { ADMIN_TOKEN_LIFETIME, error_msgs } from 'src/constants';

@Injectable()
export class AdminAuthService {
  constructor(
    private adminService: AdminService,
    private config: ConfigService,
    private jwt: JwtService,
  ) {}

  async login(credentials: LoginInputType) {
    const admin = await this.validate(credentials);
    if (!admin)
      throw new ForbiddenException(error_msgs.ADMIN_WRONG_CREDENTIALS);

    return await this.generateAdminToken(admin);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(_credentials: LoginInputType) {
    // const { username, password } = credentials;
    // const admin = await this.adminService.findAdminByUsername(username);

    // if (admin && (await argon2.verify(admin.password, password))) return admin;

    return null;
  }

  async generateAdminToken(admin) {
    delete admin.password;
    const token = this.jwt.signAsync(admin, {
      secret: this.config.get('ADMIN_JWT_SECRET'),
      expiresIn: ADMIN_TOKEN_LIFETIME,
    });
    return token;
  }
}

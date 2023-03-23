import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DoctorService {
  constructor(private readonly userService: UsersService) {}

  async scanQrCode(nationalId: string) {
    return await this.userService.findByNationalId(nationalId, {
      id: true,
      image_src: true,
      name: true,
    });
  }
}

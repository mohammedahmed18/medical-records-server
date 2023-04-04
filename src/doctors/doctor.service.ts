import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DoctorService {
  constructor(private readonly userService: UsersService) {}

  async scanQrCode(patientNationalId: string , doctorNationalId : string) {
    if(patientNationalId === doctorNationalId) throw new BadRequestException("you can't scan your qr code") 
    return await this.userService.findByNationalId(patientNationalId, {
      id: true,
      image_src: true,
      name: true,
    });
  }
}


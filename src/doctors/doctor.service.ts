import { Injectable } from '@nestjs/common';
import { CustomError } from 'src/common/errors';
import { SCAN_YOUR_SELF_ERR_CODE } from 'src/constants';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DoctorService {
  constructor(private readonly userService: UsersService) {}

  async scanQrCode(patientNationalId: string , doctorNationalId : string) {
    if(patientNationalId === doctorNationalId) throw new CustomError({
      errorCode : SCAN_YOUR_SELF_ERR_CODE,
      message : "you can't scan your qr code",
      statusCode : 400
    })
    return await this.userService.findByNationalId(patientNationalId, {
      id: true,
      image_src: true,
      name: true,
    });
  }
}


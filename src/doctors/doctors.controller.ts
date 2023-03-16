import { Doctor } from './../common/decorators/doctor.decorator';
import { Controller, Get } from '@nestjs/common';
import { DOCTORS_BASE_URL } from 'src/constants';

@Controller(DOCTORS_BASE_URL)
@Doctor()
export class DoctorsController {
  @Get()
  public testAuth() {
    return 'you are a doctor';
  }
}

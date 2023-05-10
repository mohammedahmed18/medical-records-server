import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomError } from 'src/common/errors';
import { SCAN_YOUR_SELF_ERR_CODE } from 'src/constants';
import { PrismaService } from 'src/database/prisma.service';
import { MedicalSpecialization } from 'src/graphql';
import { getDoctorsOptions } from 'src/medicalRecords/types';
import { UsersService } from 'src/users/users.service';
import { resizeCloudinaryImage } from 'src/utils/resizeCloudinaryImage';

@Injectable()
export class DoctorService {
  constructor(private readonly userService: UsersService,
              private readonly prisma : PrismaService) {}

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

  async getAllDoctors(options : getDoctorsOptions){

    const { medicalSpecialization , cursor , perPage , search} = options

    if(medicalSpecialization && ! Object.keys(MedicalSpecialization).includes(medicalSpecialization) )
      throw new BadRequestException("medical specialization not allowed")

    let curosrCraiteria = undefined
    if(cursor) curosrCraiteria = {
        id : cursor
    }
    const doctors = await this.prisma.user.findMany({
      where : {NOT : {medicalSpecialization : null} , medicalSpecialization : options.medicalSpecialization , name : {contains : search}},
      take: perPage ? parseInt(perPage) : undefined,
      skip : cursor ? 1 : undefined,
      cursor : curosrCraiteria,
      select : {
        id : true,
        name : true,
        medicalSpecialization : true,
        image_src : true
      }
    })

    return doctors.map(doctor => ({...doctor , image_src : resizeCloudinaryImage(doctor.image_src , {square : true , size : 400})}))
  }
}
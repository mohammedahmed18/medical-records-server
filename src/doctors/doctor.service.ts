import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CustomError } from 'src/common/errors';
import { SCAN_YOUR_SELF_ERR_CODE } from 'src/constants';
import { PrismaService } from 'src/database/prisma.service';
import { CreateReviewInput, MedicalSpecialization } from 'src/graphql';
import { getDoctorsOptions } from 'src/medicalRecords/types';
import { UsersService } from 'src/users/users.service';
import { resizeCloudinaryImage } from 'src/utils/resizeCloudinaryImage';

@Injectable()
export class DoctorService {
  constructor(
    private readonly userService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  async getDoctorData(doctorData, doctorId: string) {
    if (doctorData) return doctorData;
    return await this.prisma.doctorData.create({
      data: {
        userId: doctorId,
        totalRating: 0,
      },
    });
  }

  async scanQrCode(patientNationalId: string, doctorNationalId: string) {
    if (patientNationalId === doctorNationalId)
      throw new CustomError({
        errorCode: SCAN_YOUR_SELF_ERR_CODE,
        message: "you can't scan your qr code",
        statusCode: 400,
      });
    return await this.userService.findByNationalId(patientNationalId, {
      id: true,
      image_src: true,
      name: true,
    });
  }

  async getAllDoctors(options: getDoctorsOptions) {
    const {
      medicalSpecialization,
      cursor,
      perPage,
      search,
      topRated,
      mostReviews,
    } = options;
    if (
      medicalSpecialization &&
      !Object.keys(MedicalSpecialization).includes(medicalSpecialization)
    )
      throw new BadRequestException('medical specialization not allowed');

    let cursorCriteria = undefined;
    if (cursor)
      cursorCriteria = {
        id: cursor,
      };

    const orderBy: Prisma.UserOrderByWithRelationInput[] = [];

    if (topRated) {
      orderBy.push({
        DoctorData: {
          totalRating: topRated,
        },
      });
    }
    if (mostReviews) {
      orderBy.push({
        Ratings: {
          _count: mostReviews,
        },
      });
    }

    const doctors = await this.prisma.user.findMany({
      where: {
        NOT: { medicalSpecialization: null },
        medicalSpecialization: options.medicalSpecialization,
        name: { contains: search, mode: 'insensitive' },
      },
      take: perPage ? parseInt(perPage) : undefined,
      skip: cursor ? 1 : undefined,
      cursor: cursorCriteria,
      select: {
        id: true,
        name: true,
        medicalSpecialization: true,
        image_src: true,
        DoctorData: {
          select: {
            hasChatEnabled: true,
            totalRating: true,
          },
        },
        _count: { select: { Ratings: true } },
      },
      orderBy,
    });

    return await Promise.all(
      doctors.map(async (doctor) => {
        const DoctorData = await this.getDoctorData(
          doctor.DoctorData,
          doctor.id,
        );

        return {
          ...doctor,
          DoctorData,
          image_src: resizeCloudinaryImage(doctor.image_src, {
            square: true,
            size: 400,
          }),
        };
      }),
    );
  }

  async getDoctor(doctorId: string) {
    const doctor = this.userService.findById(doctorId, {
      name: true,
      image_src: true,
      medicalSpecialization: true,
      email: true,
      DoctorData: {
        select: {
          totalRating: true,
          hasChatEnabled: true,
        },
      },
      _count: { select: { writtenMedicalRecors: true } },
    });

    if (!doctor) throw new NotFoundException('No user found');

    return doctor;
  }

  async getDoctorRatings(doctorId: string) {
    if (!doctorId) throw new BadRequestException('doctor id is not specified');
    const user = await this.prisma.user.findFirst({
      where: { id: doctorId },
      select: {
        medicalSpecialization: true,
        Ratings: {
          select: {
            comment: true,
            rating: true,
            reviewer: {
              select: {
                image_src: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!user || !user.medicalSpecialization)
      throw new NotFoundException('doctor not found');
    return user.Ratings;
  }

  async getOrCreateDoctorData(doctorId: string) {
    let doctorData = await this.prisma.doctorData.findFirst({
      where: { userId: doctorId },
    });

    if (!doctorData) {
      doctorData = await this.prisma.doctorData.create({
        data: {
          userId: doctorId,
          totalRating: 0,
        },
      });
    }

    return doctorData;
  }

  async updateTotalRating(doctorId: string) {
    const ratings = await this.getDoctorRatings(doctorId);

    const averageRating =
      ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;

    const totalRating = averageRating <= 5 ? averageRating : 5;

    const doctorData = await this.getOrCreateDoctorData(doctorId);
    await this.prisma.doctorData.update({
      where: { id: doctorData.id },
      data: { totalRating },
    });
  }

  async makeReview(data: CreateReviewInput) {
    // don't review yourself
    if (data.doctorId === data.reviewerId)
      throw new BadRequestException("you can't write a review for yourself");

    // TODO: don't write a review twice for the same doctor

    const review = await this.prisma.rating.create({
      data,
    });
    // update the totalRating without blocking
    setTimeout(() => this.updateTotalRating(data.doctorId), 4000);
    return review;
  }
}

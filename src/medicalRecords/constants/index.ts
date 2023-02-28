import { Prisma } from '@prisma/client';

export const DOCTOR_SELECT_FIELDS: Prisma.UserSelect = {
  id: true,
  name: true,
  email: true,
  image_src: true,
  medicalSpecialization: true,
};

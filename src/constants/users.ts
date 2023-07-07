import { Prisma } from '@prisma/client';

export const ALL_USER_FIRST_LEVEL_FIELDS: Prisma.UserSelect = {
  id: true,
  nationalId: true,
  name: true,
  email: true,
  password: true,
  createdAt: true,
  updatedAt: true,
  hashedRt: true,
  gender: true,
  dob: true,
  avg_monthly_income: true,
  weight: true,
  height_cm: true,
  image_src: true,
  maritalStatusId: true,
  educationalLevelId: true,
  employmentStatusId: true,
  medicalSpecialization: true,
};
export const PUBLIC_FIELDS: Prisma.UserSelect = {
  id: true,
  nationalId: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  avg_monthly_income: true,
  dob: true,
  educationalLevel: {
    select: { label: true },
  },
  employmentStatus: {
    select: { label: true },
    // include : {_count : {select : {users : true}}}
  },
  gender: true,
  image_src: true,
  weight: true,
  height_cm: true,
  maritalStatus: {
    select: { label: true },
  },
  medicalSpecialization: true,
};
export const nationalId_chars = 14;
export const PASSWORD_MIN_LENGTH = 6;

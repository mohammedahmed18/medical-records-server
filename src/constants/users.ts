import { Prisma } from '@prisma/client'

export const PUBLIC_FIELDS : Prisma.UserSelect = {
    id: true,
    nationalId: true,
    name: true,
    email: true,
    createdAt: true,
    updatedAt: true,
    avg_monthly_income : true,
    dob : true,
    educationalLevel : true,
    employmentStatus : true,
    gender : true,
    image_src : true,
    weight : true,
    height_cm : true,
    maritalStatus : true
}
export const nationalId_chars = 14
export const PASSWORD_MIN_LENGTH = 6
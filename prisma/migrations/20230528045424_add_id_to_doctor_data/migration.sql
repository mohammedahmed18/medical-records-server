/*
  Warnings:

  - The required column `id` was added to the `DoctorData` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "DoctorData" ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "DoctorData_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Rating" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

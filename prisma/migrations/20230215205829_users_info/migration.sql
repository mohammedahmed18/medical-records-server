/*
  Warnings:

  - Added the required column `dob` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `educationalLevelId` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employmentStatusId` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `users` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maritalStatusId` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avg_monthly_income" DOUBLE PRECISION,
ADD COLUMN     "dob" DATE NOT NULL,
ADD COLUMN     "educationalLevelId" INTEGER NOT NULL,
ADD COLUMN     "employmentStatusId" INTEGER NOT NULL,
ADD COLUMN     "gender" "Gender" NOT NULL,
ADD COLUMN     "height_cm" DECIMAL(65,30),
ADD COLUMN     "image_src" TEXT NOT NULL DEFAULT '/images/default_pp.jpg',
ADD COLUMN     "is_admin" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maritalStatusId" INTEGER NOT NULL,
ADD COLUMN     "weight" TEXT;

-- CreateTable
CREATE TABLE "marital_status" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "marital_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "educational_level" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "educational_level_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "employment_status" (
    "id" SERIAL NOT NULL,
    "label" TEXT NOT NULL,

    CONSTRAINT "employment_status_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "user_martial_status_fk" FOREIGN KEY ("maritalStatusId") REFERENCES "marital_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_educational_level_fk" FOREIGN KEY ("educationalLevelId") REFERENCES "educational_level"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_employment_status_fk" FOREIGN KEY ("employmentStatusId") REFERENCES "employment_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

/*
  Warnings:

  - Added the required column `medicalSpecialization` to the `DoctorRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "DoctorRequest" ADD COLUMN     "medicalSpecialization" "MedicalSpecialization" NOT NULL;

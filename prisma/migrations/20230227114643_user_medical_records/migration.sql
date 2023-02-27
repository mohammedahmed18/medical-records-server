/*
  Warnings:

  - You are about to drop the column `is_admin` on the `users` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "MedicalSpecialization" AS ENUM ('Anesthesia', 'Cardiovascular', 'CommunityHealth', 'Dentistry', 'Dermatology', 'DietNutrition', 'Emergency', 'Endocrine', 'Gastroenterologic', 'Genetic', 'Geriatric', 'Gynecologic', 'Hematologic', 'Infectious', 'LaboratoryScience', 'Midwifery', 'Musculoskeletal', 'Neurologic', 'Nursing', 'Obstetric', 'Oncologic', 'Optometric', 'Otolaryngologic', 'Pathology', 'Pediatric', 'PharmacySpecialty', 'Physiotherapy', 'PlasticSurgery', 'Podiatric', 'PrimaryCare', 'Psychiatric', 'PublicHealth', 'Pulmonary', 'Radiography', 'Renal', 'RespiratoryTherapy', 'Rheumatologic', 'SpeechPathology', 'Surgical', 'Toxicologic', 'Urologic');

-- CreateEnum
CREATE TYPE "MedicalRecordsActionTypes" AS ENUM ('Generic', 'Diagnosis', 'Surgery', 'Birth', 'Death', 'Illness', 'Allergy', 'LabTest');

-- AlterTable
ALTER TABLE "users" DROP COLUMN "is_admin",
ADD COLUMN     "medicalSpecialization" "MedicalSpecialization";

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roles" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "description" TEXT,
    "roleId" TEXT NOT NULL,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medicalRecords" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "details" JSONB,
    "doctorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lifetime" BOOLEAN NOT NULL DEFAULT false,
    "actionType" "MedicalRecordsActionTypes" NOT NULL DEFAULT 'Generic',

    CONSTRAINT "medicalRecords_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_userId_key" ON "admins"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "medicalRecords_userId_key" ON "medicalRecords"("userId");

-- RenameForeignKey
ALTER TABLE "users" RENAME CONSTRAINT "user_martial_status_fk" TO "users_maritalStatusId_fkey";

-- RenameForeignKey
ALTER TABLE "users" RENAME CONSTRAINT "users_educational_level_fk" TO "users_educationalLevelId_fkey";

-- RenameForeignKey
ALTER TABLE "users" RENAME CONSTRAINT "users_employment_status_fk" TO "users_employmentStatusId_fkey";

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "permissions" ADD CONSTRAINT "permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicalRecords" ADD CONSTRAINT "medicalRecords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medicalRecords" ADD CONSTRAINT "medicalRecords_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

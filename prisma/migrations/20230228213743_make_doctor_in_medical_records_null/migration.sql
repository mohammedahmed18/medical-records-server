-- DropForeignKey
ALTER TABLE "medicalRecords" DROP CONSTRAINT "medicalRecords_doctorId_fkey";

-- AlterTable
ALTER TABLE "medicalRecords" ALTER COLUMN "doctorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "medicalRecords" ADD CONSTRAINT "medicalRecords_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- DropIndex
DROP INDEX "medicalRecords_userId_key";

-- AlterTable
ALTER TABLE "medicalRecords" ALTER COLUMN "details" SET DEFAULT '[]';

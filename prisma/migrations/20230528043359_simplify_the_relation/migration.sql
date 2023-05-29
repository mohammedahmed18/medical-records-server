/*
  Warnings:

  - You are about to drop the column `doctorDataUserId` on the `Rating` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Rating" DROP CONSTRAINT "Rating_doctorDataUserId_fkey";

-- AlterTable
ALTER TABLE "Rating" DROP COLUMN "doctorDataUserId",
ADD COLUMN     "doctorId" TEXT;

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

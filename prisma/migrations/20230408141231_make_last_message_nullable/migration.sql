-- DropForeignKey
ALTER TABLE "rooms" DROP CONSTRAINT "rooms_lastMessageId_fkey";

-- AlterTable
ALTER TABLE "rooms" ALTER COLUMN "lastMessageId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_lastMessageId_fkey" FOREIGN KEY ("lastMessageId") REFERENCES "messages"("id") ON DELETE SET NULL ON UPDATE CASCADE;

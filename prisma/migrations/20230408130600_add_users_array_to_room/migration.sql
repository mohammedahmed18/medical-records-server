-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "users" JSONB NOT NULL DEFAULT '[]';

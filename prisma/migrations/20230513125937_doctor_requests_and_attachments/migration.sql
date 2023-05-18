-- CreateEnum
CREATE TYPE "DoctorRequestStatus" AS ENUM ('waiting', 'accepted', 'denied');

-- CreateTable
CREATE TABLE "DoctorRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "moderatorId" TEXT,
    "status" "DoctorRequestStatus" NOT NULL DEFAULT 'waiting',
    "attachmentId" TEXT,

    CONSTRAINT "DoctorRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "sizeInKb" DOUBLE PRECISION,
    "medical_RecordId" TEXT,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DoctorRequest_id_key" ON "DoctorRequest"("id");

-- CreateIndex
CREATE UNIQUE INDEX "Attachment_id_key" ON "Attachment"("id");

-- AddForeignKey
ALTER TABLE "DoctorRequest" ADD CONSTRAINT "DoctorRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorRequest" ADD CONSTRAINT "DoctorRequest_moderatorId_fkey" FOREIGN KEY ("moderatorId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorRequest" ADD CONSTRAINT "DoctorRequest_attachmentId_fkey" FOREIGN KEY ("attachmentId") REFERENCES "Attachment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_medical_RecordId_fkey" FOREIGN KEY ("medical_RecordId") REFERENCES "medicalRecords"("id") ON DELETE SET NULL ON UPDATE CASCADE;

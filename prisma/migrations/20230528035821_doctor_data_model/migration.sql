-- CreateTable
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL,
    "doctorDataUserId" TEXT,
    "rating" DOUBLE PRECISION NOT NULL,
    "comment" TEXT,

    CONSTRAINT "Rating_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DoctorData" (
    "userId" TEXT NOT NULL,
    "hasChatEnabled" BOOLEAN NOT NULL DEFAULT true,
    "totalRating" DOUBLE PRECISION NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "DoctorData_userId_key" ON "DoctorData"("userId");

-- AddForeignKey
ALTER TABLE "Rating" ADD CONSTRAINT "Rating_doctorDataUserId_fkey" FOREIGN KEY ("doctorDataUserId") REFERENCES "DoctorData"("userId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DoctorData" ADD CONSTRAINT "DoctorData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

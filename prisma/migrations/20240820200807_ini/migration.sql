-- CreateEnum
CREATE TYPE "Weekday" AS ENUM ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday');

-- CreateEnum
CREATE TYPE "Media" AS ENUM ('Online', 'Offline', 'Hybrid');

-- CreateEnum
CREATE TYPE "AssignmentStatus" AS ENUM ('Pending', 'Accepted', 'Declined');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "description" TEXT,
ADD COLUMN     "jurusan" TEXT;

-- DropEnum
DROP TYPE "Status";

-- CreateTable
CREATE TABLE "Appointment" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "availableDays" "Weekday"[],
    "timeRange" JSONB NOT NULL,
    "media" "Media" NOT NULL,

    CONSTRAINT "Appointment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppointmentAssignment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "appointmentId" INTEGER NOT NULL,
    "selectedDate" TIMESTAMP(3) NOT NULL,
    "selectedTime" TIMESTAMP(3) NOT NULL,
    "peopleCount" INTEGER NOT NULL,
    "status" "AssignmentStatus" NOT NULL DEFAULT 'Pending',

    CONSTRAINT "AppointmentAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Material" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentAssignment" ADD CONSTRAINT "AppointmentAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppointmentAssignment" ADD CONSTRAINT "AppointmentAssignment_appointmentId_fkey" FOREIGN KEY ("appointmentId") REFERENCES "Appointment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

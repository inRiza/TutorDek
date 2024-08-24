/*
  Warnings:

  - Added the required column `media` to the `AppointmentAssignment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Duration" AS ENUM ('ONE_HOUR', 'ONE_AND_HALF', 'TWO_HOURS', 'TWO_AND_HALF', 'THREE_HOURS');

-- AlterTable
ALTER TABLE "AppointmentAssignment" ADD COLUMN     "duration" "Duration" NOT NULL DEFAULT 'ONE_HOUR',
ADD COLUMN     "media" "Media" NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "calendar" TEXT;

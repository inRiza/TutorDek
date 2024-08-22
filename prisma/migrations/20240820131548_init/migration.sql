-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('Mahasiswa', 'Tutor', 'Admin');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullName" TEXT NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "role" "Roles" NOT NULL DEFAULT 'Mahasiswa',
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

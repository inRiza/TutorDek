/*
  Warnings:

  - You are about to drop the column `userId` on the `Material` table. All the data in the column will be lost.
  - Added the required column `title` to the `Material` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Material" DROP CONSTRAINT "Material_userId_fkey";

-- AlterTable
ALTER TABLE "Material" DROP COLUMN "userId",
ADD COLUMN     "title" TEXT NOT NULL;

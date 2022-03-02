/*
  Warnings:

  - You are about to drop the column `logoUri` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `avatarUri` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "logoUri",
ADD COLUMN     "logoUrl" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "avatarUri",
ADD COLUMN     "avatarUrl" TEXT;

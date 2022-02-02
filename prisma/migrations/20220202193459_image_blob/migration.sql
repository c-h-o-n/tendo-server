/*
  Warnings:

  - Added the required column `profileImagePath` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileImagePath",
ADD COLUMN     "profileImagePath" BYTEA NOT NULL;

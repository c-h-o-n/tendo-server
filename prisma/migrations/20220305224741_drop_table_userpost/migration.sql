/*
  Warnings:

  - You are about to drop the `UserPost` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserPost" DROP CONSTRAINT "UserPost_sourceId_fkey";

-- DropTable
DROP TABLE "UserPost";

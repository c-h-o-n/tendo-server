/*
  Warnings:

  - You are about to drop the column `games` on the `Team` table. All the data in the column will be lost.
  - You are about to drop the column `games` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Team" DROP COLUMN "games";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "games";

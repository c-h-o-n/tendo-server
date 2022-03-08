/*
  Warnings:

  - Made the column `teamAId` on table `Match` required. This step will fail if there are existing NULL values in that column.
  - Made the column `teamBId` on table `Match` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Match" ALTER COLUMN "teamAId" SET NOT NULL,
ALTER COLUMN "teamBId" SET NOT NULL;

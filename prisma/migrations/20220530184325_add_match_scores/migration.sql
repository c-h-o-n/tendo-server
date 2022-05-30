/*
  Warnings:

  - Added the required column `teamAScore` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `teamBScore` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "teamAScore" INTEGER NOT NULL,
ADD COLUMN     "teamBScore" INTEGER NOT NULL;

/*
  Warnings:

  - Made the column `wins` on table `Team` required. This step will fail if there are existing NULL values in that column.
  - Made the column `loses` on table `Team` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "wins" SET NOT NULL,
ALTER COLUMN "wins" SET DEFAULT 0,
ALTER COLUMN "loses" SET NOT NULL,
ALTER COLUMN "loses" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "wins" SET DEFAULT 0,
ALTER COLUMN "loses" SET DEFAULT 0;

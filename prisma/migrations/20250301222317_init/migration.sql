/*
  Warnings:

  - Added the required column `giveQuestions` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `time` to the `Game` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "giveQuestions" INTEGER NOT NULL,
ADD COLUMN     "time" INTEGER NOT NULL;

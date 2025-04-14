/*
  Warnings:

  - Added the required column `AssociatedSkill` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `MediaURL` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Added the required column `SkillSet` to the `Question` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `difficulty` on the `Question` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Question` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "AssociatedSkill" TEXT NOT NULL,
ADD COLUMN     "MediaURL" TEXT NOT NULL,
ADD COLUMN     "SkillSet" TEXT NOT NULL,
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" TEXT NOT NULL,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- DropEnum
DROP TYPE "Difficulty";

-- DropEnum
DROP TYPE "QuestionType";

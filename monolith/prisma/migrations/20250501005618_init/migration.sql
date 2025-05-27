/*
  Warnings:

  - You are about to drop the column `type` on the `Question` table. All the data in the column will be lost.
  - Changed the type of `education` on the `Player` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `modality` to the `Question` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "education",
ADD COLUMN     "education" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "type",
ADD COLUMN     "modality" TEXT NOT NULL;

/*
  Warnings:

  - You are about to drop the column `stats` on the `Attempt` table. All the data in the column will be lost.
  - Added the required column `education` to the `Player` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Attempt" DROP COLUMN "stats",
ALTER COLUMN "timeTaken" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "education" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "AttemptDetails" (
    "id" SERIAL NOT NULL,
    "attemptId" INTEGER NOT NULL,
    "StartTime" TIMESTAMP(3) NOT NULL,
    "EndTime" TIMESTAMP(3),
    "easyTotal" INTEGER NOT NULL DEFAULT 0,
    "easyCorrect" INTEGER NOT NULL DEFAULT 0,
    "midTotal" INTEGER NOT NULL DEFAULT 0,
    "midCorrect" INTEGER NOT NULL DEFAULT 0,
    "mediumTotal" INTEGER NOT NULL DEFAULT 0,
    "mediumCorrect" INTEGER NOT NULL DEFAULT 0,
    "hardTotal" INTEGER NOT NULL DEFAULT 0,
    "hardCorrect" INTEGER NOT NULL DEFAULT 0,
    "advancedTotal" INTEGER NOT NULL DEFAULT 0,
    "advancedCorrect" INTEGER NOT NULL DEFAULT 0,
    "exceptionalTotal" INTEGER NOT NULL DEFAULT 0,
    "exceptionalCorrect" INTEGER NOT NULL DEFAULT 0,
    "textualTotal" INTEGER NOT NULL DEFAULT 0,
    "textualCorrect" INTEGER NOT NULL DEFAULT 0,
    "imageTotal" INTEGER NOT NULL DEFAULT 0,
    "imageCorrect" INTEGER NOT NULL DEFAULT 0,
    "auditoryTotal" INTEGER NOT NULL DEFAULT 0,
    "auditoryCorrect" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AttemptDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AttemptDetails" ADD CONSTRAINT "AttemptDetails_attemptId_fkey" FOREIGN KEY ("attemptId") REFERENCES "Attempt"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

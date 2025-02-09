/*
  Warnings:

  - You are about to drop the column `organizationId` on the `Admins` table. All the data in the column will be lost.
  - You are about to drop the column `organizationId` on the `Game` table. All the data in the column will be lost.
  - The primary key for the `PlayerInstitution` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `organizationId` on the `PlayerInstitution` table. All the data in the column will be lost.
  - You are about to drop the `Organization` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `institutionId` to the `Admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `password` to the `Admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `Admins` table without a default value. This is not possible if the table is not empty.
  - Added the required column `institutionId` to the `Game` table without a default value. This is not possible if the table is not empty.
  - Added the required column `token` to the `Player` table without a default value. This is not possible if the table is not empty.
  - Added the required column `institutionId` to the `PlayerInstitution` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Admins" DROP CONSTRAINT "Admins_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "PlayerInstitution" DROP CONSTRAINT "PlayerInstitution_organizationId_fkey";

-- AlterTable
ALTER TABLE "Admins" DROP COLUMN "organizationId",
ADD COLUMN     "institutionId" INTEGER NOT NULL,
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "token" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Game" DROP COLUMN "organizationId",
ADD COLUMN     "institutionId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "token" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PlayerInstitution" DROP CONSTRAINT "PlayerInstitution_pkey",
DROP COLUMN "organizationId",
ADD COLUMN     "institutionId" INTEGER NOT NULL,
ADD CONSTRAINT "PlayerInstitution_pkey" PRIMARY KEY ("playerId", "institutionId");

-- DropTable
DROP TABLE "Organization";

-- CreateTable
CREATE TABLE "Institution" (
    "id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institution_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Institution_email_key" ON "Institution"("email");

-- AddForeignKey
ALTER TABLE "Admins" ADD CONSTRAINT "Admins_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerInstitution" ADD CONSTRAINT "PlayerInstitution_institutionId_fkey" FOREIGN KEY ("institutionId") REFERENCES "Institution"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

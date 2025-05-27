/*
  Warnings:

  - You are about to drop the column `type` on the `Institution` table. All the data in the column will be lost.
  - Added the required column `typeId` to the `Institution` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Institution" DROP COLUMN "type",
ADD COLUMN     "typeId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "InstitutionTypes" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "InstitutionTypes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Institution" ADD CONSTRAINT "Institution_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "InstitutionTypes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

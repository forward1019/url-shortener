/*
  Warnings:

  - You are about to alter the column `shortSlug` on the `Link` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(15)`.
  - Added the required column `originDomain` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "originDomain" TEXT NOT NULL,
ALTER COLUMN "shortSlug" SET DATA TYPE VARCHAR(15);

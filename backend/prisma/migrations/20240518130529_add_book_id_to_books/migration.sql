/*
  Warnings:

  - Added the required column `Book_Id` to the `books` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `books` ADD COLUMN `Book_Id` VARCHAR(191) NOT NULL;

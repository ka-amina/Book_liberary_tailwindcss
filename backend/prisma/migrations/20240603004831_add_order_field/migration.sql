/*
  Warnings:

  - Added the required column `Book_Id` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `book` ADD COLUMN `Book_Id` VARCHAR(191) NOT NULL,
    ADD COLUMN `deletedAt` DATETIME(3) NULL,
    ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;

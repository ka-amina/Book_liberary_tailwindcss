/*
  Warnings:

  - You are about to drop the column `order` on the `books` table. All the data in the column will be lost.
  - You are about to drop the `book` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `books` DROP COLUMN `order`;

-- DropTable
DROP TABLE `book`;

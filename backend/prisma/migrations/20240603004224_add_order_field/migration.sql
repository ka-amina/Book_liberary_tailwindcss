-- CreateTable
CREATE TABLE `Book` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `Title` VARCHAR(191) NOT NULL,
    `Author` VARCHAR(191) NOT NULL,
    `Price` DOUBLE NOT NULL,
    `Cover` VARCHAR(191) NOT NULL,
    `order` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

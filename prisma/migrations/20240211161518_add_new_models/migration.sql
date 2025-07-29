/*
  Warnings:

  - You are about to drop the column `Usuario` on the `compras` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `compras` DROP COLUMN `Usuario`,
    MODIFY `Fecha` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `User` (
    `id_User` INTEGER NOT NULL AUTO_INCREMENT,
    `User` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id_User`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Compra` (
    `id_Compra` INTEGER NOT NULL AUTO_INCREMENT,
    `id_Usuario` INTEGER NOT NULL,
    `Producto` VARCHAR(191) NOT NULL,
    `Descripcion` VARCHAR(191) NOT NULL,
    `Costo` INTEGER NOT NULL,
    `Precio_Venta` INTEGER NOT NULL,
    `Stock` INTEGER NOT NULL,
    `Fecha` VARCHAR(191) NOT NULL,
    `Total` INTEGER NOT NULL,

    PRIMARY KEY (`id_Compra`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Venta` (
    `id_Venta` INTEGER NOT NULL AUTO_INCREMENT,
    `id_Producto` INTEGER NOT NULL,
    `id_Usuario` INTEGER NOT NULL,
    `Fecha` VARCHAR(191) NOT NULL,
    `Cantidad` INTEGER NOT NULL,
    `Precio_Compra` VARCHAR(191) NOT NULL,
    `Precio_Venta` VARCHAR(191) NOT NULL,
    `Total` INTEGER NOT NULL,

    PRIMARY KEY (`id_Venta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Compra` ADD CONSTRAINT `Compra_id_Usuario_fkey` FOREIGN KEY (`id_Usuario`) REFERENCES `User`(`id_User`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Venta` ADD CONSTRAINT `Venta_id_Producto_fkey` FOREIGN KEY (`id_Producto`) REFERENCES `Producto`(`Id_Producto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Venta` ADD CONSTRAINT `Venta_id_Usuario_fkey` FOREIGN KEY (`id_Usuario`) REFERENCES `User`(`id_User`) ON DELETE RESTRICT ON UPDATE CASCADE;

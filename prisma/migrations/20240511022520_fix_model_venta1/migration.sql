/*
  Warnings:

  - You are about to drop the `compra` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `compras` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `usuarios` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `venta` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `compra` DROP FOREIGN KEY `Compra_id_Usuario_fkey`;

-- DropForeignKey
ALTER TABLE `compras` DROP FOREIGN KEY `Compras_id_Usuario_fkey`;

-- DropForeignKey
ALTER TABLE `venta` DROP FOREIGN KEY `Venta_id_Producto_fkey`;

-- DropForeignKey
ALTER TABLE `venta` DROP FOREIGN KEY `Venta_id_Usuario_fkey`;

-- DropTable
DROP TABLE `compra`;

-- DropTable
DROP TABLE `compras`;

-- DropTable
DROP TABLE `usuarios`;

-- DropTable
DROP TABLE `venta`;

-- CreateTable
CREATE TABLE `Venta1` (
    `id_Venta` INTEGER NOT NULL AUTO_INCREMENT,
    `id_Producto` INTEGER NOT NULL,
    `id_Usuario` INTEGER NOT NULL,
    `precio_Costo` VARCHAR(191) NOT NULL,
    `precio_Venta` VARCHAR(191) NOT NULL,
    `cantidad` INTEGER NOT NULL,
    `dia` VARCHAR(191) NOT NULL,
    `mes` VARCHAR(191) NOT NULL,
    `anio` VARCHAR(191) NOT NULL,
    `total` INTEGER NOT NULL,

    PRIMARY KEY (`id_Venta`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Compra1` (
    `id_Compra` INTEGER NOT NULL AUTO_INCREMENT,
    `id_Usuario` INTEGER NOT NULL,
    `Producto` VARCHAR(191) NOT NULL,
    `Descripcion` VARCHAR(191) NOT NULL,
    `Precio_Costo` INTEGER NOT NULL,
    `Precio_Venta` INTEGER NOT NULL,
    `Stock` INTEGER NOT NULL,
    `Dia` VARCHAR(191) NOT NULL,
    `Mes` VARCHAR(191) NOT NULL,
    `Anio` VARCHAR(191) NOT NULL,
    `Total` INTEGER NOT NULL,

    PRIMARY KEY (`id_Compra`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Venta1` ADD CONSTRAINT `Venta1_id_Producto_fkey` FOREIGN KEY (`id_Producto`) REFERENCES `Producto`(`Id_Producto`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Venta1` ADD CONSTRAINT `Venta1_id_Usuario_fkey` FOREIGN KEY (`id_Usuario`) REFERENCES `User`(`id_User`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Compra1` ADD CONSTRAINT `Compra1_id_Usuario_fkey` FOREIGN KEY (`id_Usuario`) REFERENCES `User`(`id_User`) ON DELETE RESTRICT ON UPDATE CASCADE;

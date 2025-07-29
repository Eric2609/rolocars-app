/*
  Warnings:

  - Added the required column `Anio` to the `Compra` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Rol` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Anio` to the `Venta` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `compra` ADD COLUMN `Anio` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `Rol` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `venta` ADD COLUMN `Anio` VARCHAR(191) NOT NULL;

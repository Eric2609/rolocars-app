/*
  Warnings:

  - You are about to drop the column `Anio` on the `compra1` table. All the data in the column will be lost.
  - You are about to drop the column `Dia` on the `compra1` table. All the data in the column will be lost.
  - You are about to drop the column `Mes` on the `compra1` table. All the data in the column will be lost.
  - You are about to drop the column `anio` on the `venta1` table. All the data in the column will be lost.
  - You are about to drop the column `dia` on the `venta1` table. All the data in the column will be lost.
  - You are about to drop the column `mes` on the `venta1` table. All the data in the column will be lost.
  - Added the required column `Fecha` to the `Compra1` table without a default value. This is not possible if the table is not empty.
  - Added the required column `fecha` to the `Venta1` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `compra1` DROP COLUMN `Anio`,
    DROP COLUMN `Dia`,
    DROP COLUMN `Mes`,
    ADD COLUMN `Fecha` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `venta1` DROP COLUMN `anio`,
    DROP COLUMN `dia`,
    DROP COLUMN `mes`,
    ADD COLUMN `fecha` DATETIME(3) NOT NULL;

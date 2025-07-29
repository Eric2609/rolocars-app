-- CreateTable
CREATE TABLE `Compras` (
    `id_Compra` INTEGER NOT NULL AUTO_INCREMENT,
    `id_Usuario` INTEGER NOT NULL,
    `Usuario` VARCHAR(191) NOT NULL,
    `Producto` VARCHAR(191) NOT NULL,
    `Descripcion` VARCHAR(191) NOT NULL,
    `Costo` INTEGER NOT NULL,
    `Precio_Venta` INTEGER NOT NULL,
    `Stock` INTEGER NOT NULL,
    `Fecha` DATETIME(3) NOT NULL,
    `Total` INTEGER NOT NULL,

    PRIMARY KEY (`id_Compra`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Usuarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `User` VARCHAR(191) NOT NULL,
    `Password` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Compras` ADD CONSTRAINT `Compras_id_Usuario_fkey` FOREIGN KEY (`id_Usuario`) REFERENCES `Usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

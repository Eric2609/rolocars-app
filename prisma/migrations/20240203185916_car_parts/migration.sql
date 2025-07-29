-- CreateTable
CREATE TABLE `Producto` (
    `Id_Producto` INTEGER NOT NULL AUTO_INCREMENT,
    `Producto` VARCHAR(191) NULL,
    `Descripcion` VARCHAR(191) NULL,
    `Precio_Compra` INTEGER NOT NULL,
    `Precio_Venta` INTEGER NOT NULL,
    `Stock` INTEGER NOT NULL,

    PRIMARY KEY (`Id_Producto`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


-- CreateTable
CREATE TABLE "Producto" (
    "Id_Producto" SERIAL NOT NULL,
    "Producto" TEXT,
    "Descripcion" TEXT,
    "Precio_Compra" INTEGER NOT NULL,
    "Precio_Venta" INTEGER NOT NULL,
    "Stock" INTEGER NOT NULL,

    CONSTRAINT "Producto_pkey" PRIMARY KEY ("Id_Producto")
);

-- CreateTable
CREATE TABLE "User" (
    "id_User" SERIAL NOT NULL,
    "User" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Rol" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id_User")
);

-- CreateTable
CREATE TABLE "Venta1" (
    "id_Venta" SERIAL NOT NULL,
    "id_Producto" INTEGER NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "precio_Costo" TEXT NOT NULL,
    "precio_Venta" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "total" INTEGER NOT NULL,

    CONSTRAINT "Venta1_pkey" PRIMARY KEY ("id_Venta")
);

-- CreateTable
CREATE TABLE "Compra1" (
    "id_Compra" SERIAL NOT NULL,
    "id_Usuario" INTEGER NOT NULL,
    "Producto" TEXT NOT NULL,
    "Descripcion" TEXT NOT NULL,
    "Precio_Costo" INTEGER NOT NULL,
    "Precio_Venta" INTEGER NOT NULL,
    "Stock" INTEGER NOT NULL,
    "Fecha" TIMESTAMP(3) NOT NULL,
    "Total" INTEGER NOT NULL,

    CONSTRAINT "Compra1_pkey" PRIMARY KEY ("id_Compra")
);

-- AddForeignKey
ALTER TABLE "Venta1" ADD CONSTRAINT "Venta1_id_Producto_fkey" FOREIGN KEY ("id_Producto") REFERENCES "Producto"("Id_Producto") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Venta1" ADD CONSTRAINT "Venta1_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "User"("id_User") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Compra1" ADD CONSTRAINT "Compra1_id_Usuario_fkey" FOREIGN KEY ("id_Usuario") REFERENCES "User"("id_User") ON DELETE RESTRICT ON UPDATE CASCADE;

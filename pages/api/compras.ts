import { prisma } from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // GET → obtener todas las compras
    if (req.method === 'GET') {
      const compras = await prisma.compra1.findMany();
      return res.status(200).json(compras);
    }

    const {
      id_Compra,
      id_Usuario,
      Producto,
      Descripcion,
      Precio_Costo,
      Precio_Venta,
      Stock,
      Fecha,       // desde frontend
      Total,
      Proveedor,   // opcional
      Saldo        // opcional
    } = req.body;

    console.log("🟡 Fecha recibida desde frontend:", Fecha);
    console.log("🔵 Resultado new Date(Fecha):", new Date(Fecha));

    // POST → crear nueva compra
    if (req.method === 'POST') {
      const nuevaCompra = await prisma.compra1.create({
        data: {
          id_Usuario: Number(id_Usuario),
          Producto: Producto ?? '',
          Descripcion: Descripcion ?? '',
          Precio_Costo: Number(Precio_Costo),
          Precio_Venta: Number(Precio_Venta),
          Stock: Number(Stock),
          Fecha: Fecha ? new Date(Fecha) : new Date(),
          Total: Number(Total ?? 0),
          Proveedor: Proveedor ?? null,
          Saldo: Saldo != null ? Number(Saldo) : null
        },
      });
      return res.status(201).json(nuevaCompra);
    }

    // PUT → actualizar compra
    if (req.method === 'PUT') {
      const actualizada = await prisma.compra1.update({
        where: { id_Compra: parseInt(id_Compra) },
        data: {
          id_Usuario: Number(id_Usuario),
          Producto: Producto ?? '',
          Descripcion: Descripcion ?? '',
          Precio_Costo: Number(Precio_Costo),
          Precio_Venta: Number(Precio_Venta),
          Stock: Number(Stock),
          Fecha: Fecha ? new Date(Fecha) : new Date(),
          Total: Number(Total ?? 0),
          Proveedor: Proveedor ?? null,
          Saldo: Saldo != null ? Number(Saldo) : null
        },
      });
      return res.status(200).json(actualizada);
    }

    // DELETE → eliminar compra
    if (req.method === 'DELETE') {
      const { Id } = req.query;
      const postId =
        typeof Id === 'string'
          ? parseInt(Id)
          : Array.isArray(Id)
          ? parseInt(Id[0])
          : Id;
      const deleted = await prisma.compra1.delete({
        where: { id_Compra: postId },
      });
      return res.status(200).json(deleted);
    }

    return res.status(405).end(); // método no permitido
  } catch (error) {
    console.error('Error en API /api/compra1:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

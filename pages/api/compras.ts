import { prisma } from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    Fecha, // ← en minúscula desde el frontend
    Total,
  } = req.body;

console.log("🟡 Fecha recibida desde frontend:", Fecha);
console.log("🔵 Resultado new Date(fecha):", new Date(Fecha));


  try {
    if (req.method === 'POST') {
      const nuevaCompra = await prisma.compra1.create({
        data: {
          id_Usuario,
          Producto,
          Descripcion,
          Precio_Costo,
          Precio_Venta,
          Stock,
          Fecha: new Date(Fecha), // ← mapeamos correctamente a "Fecha"
          Total,
        },
      });
      return res.status(201).json(nuevaCompra);
    }

    if (req.method === 'PUT') {
      const actualizada = await prisma.compra1.update({
        where: { id_Compra: parseInt(id_Compra) },
        data: {
          id_Usuario,
          Producto,
          Descripcion,
          Precio_Costo,
          Precio_Venta,
          Stock,
          Fecha: new Date(Fecha), // ← corregido también aquí
          Total,
        },
      });
      return res.status(200).json(actualizada);
    }

    if (req.method === 'DELETE') {
      const { Id } = req.query;
      const postId = typeof Id === 'string' ? parseInt(Id) : Array.isArray(Id) ? parseInt(Id[0]) : Id;
      const deleted = await prisma.compra1.delete({
        where: { id_Compra: postId },
      });
      return res.status(200).json(deleted);
    }

    return res.status(405).end();
  } catch (error) {
    console.error('Error en API /api/compra1:', error);
    return res.status(500).json({ error: 'Error interno del servidor' });
  }
}

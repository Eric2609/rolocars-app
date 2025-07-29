
import { prisma } from '../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const ventas = await prisma.venta1.findMany();
    return res.status(200).json(ventas);
  }

  const {
    id_Venta,
    id_Producto,
    id_Usuario,
    precio_Costo,
    precio_Venta,
    cantidad,
    fecha, 
    total,
  } = req.body;

console.log('REQ.BODY:', req.body);


  try {
if (req.method === 'POST') {
  if (!fecha || isNaN(Date.parse(fecha))) {
    console.error('Fecha inválida:', fecha);
    return res.status(400).json({ error: 'Fecha inválida. Formato incorrecto.' });
  }

  const post = await prisma.venta1.create({
    data: {
      id_Producto,
      id_Usuario,
      precio_Costo,
      precio_Venta,
      cantidad,
      fecha: new Date(fecha),
      total,
    },
  });
  return res.status(201).json(post);
}

if (req.method === 'PUT') {
  if (!fecha || isNaN(Date.parse(fecha))) {
    console.error('Fecha inválida:', fecha);
    return res.status(400).json({ error: 'Fecha inválida. Formato incorrecto.' });
  }

  const post = await prisma.venta1.update({
    where: { id_Venta: parseInt(id_Venta) },
    data: {
      id_Producto,
      id_Usuario,
      precio_Costo,
      precio_Venta,
      cantidad,
      fecha: new Date(fecha),
      total,
    },
  });
  return res.status(200).json(post);
}

    if (req.method === 'DELETE') {
      const { Id } = req.query;
      const postId = typeof Id === 'string' ? parseInt(Id) : Array.isArray(Id) ? parseInt(Id[0]) : Id;
      const post = await prisma.venta1.delete({
        where: { id_Venta: postId },
      });
      return res.status(200).json(post);
    }

    return res.status(405).end();
  } catch (error) {
    console.error('Error en /api/ventas:', error);
    return res.status(500).json({ error: 'Error en el servidor' });
  }
}

import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { 
    Id_Producto, 
    Producto, 
    Descripcion, 
    Precio_Compra, 
    Precio_Venta, 
    Stock} = req.body;
  if (req.method === 'GET') {
    const productos = await prisma.producto.findMany();
    res.status(200).json(productos);
  } else if (req.method === 'POST') {
    const post = await prisma.producto.create({
      data: {
        Producto,
        Descripcion,
        Precio_Compra,
        Precio_Venta,
        Stock,
      },
    });
    res.status(201).json(post);
  } else if (req.method === 'PUT') {
    const post = await prisma.producto.update({
      where: { Id_Producto: Id_Producto},
      data: {
        Producto,
        Descripcion,
        Precio_Compra,
        Precio_Venta,
        Stock,
      },
    });
    res.status(201).json(post);
  } else if (req.method === 'DELETE') {
    const { Id } = req.query;
    const postId = typeof Id === 'string' ? parseInt(Id) : Array.isArray(Id) ? parseInt(Id[0]) : Id;
    const post = await prisma.producto.delete({
      where: { Id_Producto: postId },
    });
    res.status(201).json(post);
  }
  else {
    res.status(405).end();
  }
}
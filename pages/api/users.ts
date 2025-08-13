import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../lib/prisma';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log('DATABASE_URL:', process.env.DATABASE_URL); // <-- para verificar que carga la variable

  try {
    if (req.method === 'GET') {
      const users = await prisma.user.findMany();
      res.status(200).json(users);
    } else if (req.method === 'POST') {
      const { User, Password, Rol } = req.body;
      const post = await prisma.user.create({
        data: {
          User,
          Password,
          Rol,
        },
      });
      res.status(201).json(post);
    } else if (req.method === 'PUT') {
      const { id_User, User, Password, Rol } = req.body;
      const post = await prisma.user.update({
        where: { id_User: id_User },
        data: {
          User,
          Password,
          Rol,
        },
      });
      res.status(201).json(post);
    } else if (req.method === 'DELETE') {
      const { Id } = req.query;
      const postId = typeof Id === 'string' ? parseInt(Id) : Array.isArray(Id) ? parseInt(Id[0]) : Id;
      const post = await prisma.user.delete({
        where: { id_User: postId },
      });
      res.status(201).json(post);
    } else {
      res.status(405).end();
    }
  } catch (error) {
    console.error('Error en API users:', error);
    res.status(500).json({ error: 'Error connecting to database' });
  }
}

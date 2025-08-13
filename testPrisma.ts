import { prisma } from './lib/prisma'  // asegúrate que la ruta es correcta

async function main() {
  try {
    const users = await prisma.user.findMany()
    console.log('Usuarios en la base:', users)
  } catch (error) {
    console.error('Error conectando con la BD:', error)
  } finally {
    await prisma.$disconnect()
  }
}

main()


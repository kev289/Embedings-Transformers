import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. Creamos un usuario de prueba (Kevinsino)
  const user = await prisma.user.upsert({
    where: { email: 'kevinsino@admin.com' },
    update: {},
    create: {
      email: 'kevinsino@admin.com',
      name: 'kevinsino',
      password: 'hash_de_prueba', // Luego lo cambiaremos por uno real con bcrypt
    },
  })

  const MOCK_EMBEDDINGS = [
    { text: "El desarrollo de software con .NET es potente", vector: [0.012, -0.045, 0.033] },
    { text: "La ganadería requiere cuidados veterinarios", vector: [0.089, 0.012, -0.011] },
    { text: "Las vacas producen leche fresca cada mañana", vector: [0.092, 0.015, -0.015] }
  ];

  console.log('subiendo datos');

  for (const item of MOCK_EMBEDDINGS) {
    await prisma.comparison.create({
      data: {
        text: item.text,
        vector: JSON.stringify(item.vector), // Importante: convertir a string
        userId: user.id
      }
    })
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  const email = 'admin@projing.pro'
  const password = await bcrypt.hash('123456', 10)

  const existing = await prisma.user.findUnique({ where: { email } })
  if (!existing) {
    await prisma.user.create({
      data: {
        name: 'Administrador',
        email,
        password
      }
    })
    console.log('✅ Usuário admin criado: admin@projing.pro / 123456')
  } else {
    console.log('ℹ️ Usuário admin já existe.')
  }
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

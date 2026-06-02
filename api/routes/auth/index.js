import bcrypt from 'bcryptjs'

export default async function (fastify, opts) {
  // Login Endpoint
  fastify.post('/login', async function (request, reply) {
    const { email, password } = request.body

    const user = await fastify.prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return reply.code(401).send({ error: 'Credenciais inválidas' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return reply.code(401).send({ error: 'Credenciais inválidas' })
    }

    const token = fastify.jwt.sign({ id: user.id, email: user.email, name: user.name })
    return { token, user: { id: user.id, email: user.email, name: user.name } }
  })

  // Register Endpoint
  fastify.post('/register', async function (request, reply) {
    const { name, email, password } = request.body

    if (!name || !email || !password) {
      return reply.code(400).send({ error: 'Nome, email e senha são obrigatórios' })
    }

    const existingUser = await fastify.prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return reply.code(400).send({ error: 'Já existe uma conta com este e-mail' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await fastify.prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      }
    })

    const token = fastify.jwt.sign({ id: user.id, email: user.email, name: user.name })
    return { token, user: { id: user.id, email: user.email, name: user.name } }
  })

  // Get Current User (Protected)
  fastify.get('/me', {
    onRequest: [fastify.authenticate]
  }, async function (request, reply) {
    return request.user
  })
}
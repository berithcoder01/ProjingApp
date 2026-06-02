export default async function (fastify, opts) {
  // Get company settings (creates default if it doesn't exist)
  fastify.get('/', async function (request, reply) {
    let settings = await fastify.prisma.companySettings.findFirst()
    if (!settings) {
      settings = await fastify.prisma.companySettings.create({
        data: {} // uses defaults from schema
      })
    }
    return settings
  })

  // Update company settings
  fastify.put('/', async function (request, reply) {
    const data = request.body
    let settings = await fastify.prisma.companySettings.findFirst()
    
    if (settings) {
      settings = await fastify.prisma.companySettings.update({
        where: { id: settings.id },
        data
      })
    } else {
      settings = await fastify.prisma.companySettings.create({
        data
      })
    }
    return settings
  })
}

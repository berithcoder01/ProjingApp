export default async function (fastify, opts) {
  fastify.get('/stats', async function (request, reply) {
    const totalProposals = await fastify.prisma.proposal.count()
    const totalClients = await fastify.prisma.client.count()
    
    // Propostas nos últimos 30 dias
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    
    const recentProposals = await fastify.prisma.proposal.count({
      where: {
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    })

    // Valor total de todas as propostas
    const sumResult = await fastify.prisma.proposal.aggregate({
      _sum: {
        total: true
      },
      _avg: {
        total: true
      }
    })

    // Estatísticas de propostas aprovadas
    const approvedResult = await fastify.prisma.proposal.aggregate({
      where: { status: 'APPROVED' },
      _sum: { total: true },
      _count: { id: true }
    })

    return {
      totalProposals,
      totalClients,
      recentProposals,
      totalValue: sumResult._sum.total || 0,
      averageValue: sumResult._avg.total || 0,
      approvedValue: approvedResult._sum.total || 0,
      approvedCount: approvedResult._count.id || 0
    }
  })

  fastify.get('/recent', async function (request, reply) {
    return fastify.prisma.proposal.findMany({
      take: 5,
      orderBy: {
        createdAt: 'desc'
      },
      select: {
        id: true,
        number: true,
        clientName: true,
        total: true,
        status: true,
        createdAt: true,
        metadata: true
      }
    })
  })
}

export default async function (fastify, opts) {
  fastify.get('/', async function (request, reply) {
    return fastify.prisma.proposal.findMany({
      include: {
        items: true,
        conditions: true
      }
    })
  })

  fastify.get('/:id', async function (request, reply) {
    const { id } = request.params
    const proposal = await fastify.prisma.proposal.findUnique({
      where: { id },
      include: {
        items: true,
        conditions: true
      }
    })
    if (!proposal) return reply.notFound('Proposta não encontrada')
    return proposal
  })

  fastify.patch('/:id/status', async function (request, reply) {
    const { id } = request.params
    const { status } = request.body
    
    try {
      const updated = await fastify.prisma.proposal.update({
        where: { id },
        data: { status }
      })
      return updated
    } catch (error) {
      return reply.code(400).send({ error: 'Falha ao atualizar status' })
    }
  })

  fastify.post('/', async function (request, reply) {
    const { cliente, clientName, items, cond, propNum, title, value, status, metadata } = request.body

    // Se tem metadata, é proposal de armazém
    if (metadata) {
      const proposal = await fastify.prisma.proposal.create({
        data: {
          number: propNum || metadata.numeroProposta || `ARM-${Date.now()}`,
          title: title,
          clientName: clientName || metadata.clientName || cliente?.nome || metadata.cliente || 'Cliente não identificado',
          clientContact: metadata.contato || '',
          location: metadata.local || '',
          object: metadata.objeto || '',
          total: parseFloat(value) || parseFloat(metadata.totalGeral) || 0,
          status: status || 'DRAFT',
          metadata: metadata
        }
      })
      return proposal
    }

    // Proposal padrão com itens do catálogo
    const total = items.reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0), 0)

    const proposal = await fastify.prisma.proposal.create({
      data: {
        number: propNum,
        clientName: cliente.nome,
        clientContact: cliente.contato,
        clientRole: cliente.cargo,
        location: cliente.local,
        phone: cliente.tel,
        object: cliente.objeto,
        total: total,
        items: {
          create: items.map(it => ({
            catalogId: it.id,
            label: it.label,
            unit: it.unit,
            quantity: parseFloat(it.qty) || 0,
            unitPrice: parseFloat(it.price) || 0,
            subtotal: (parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0)
          }))
        },
        conditions: {
          create: {
            downPayment: parseFloat(cond.entrada) || 0,
            downPaymentDays: parseInt(cond.prazoEntrada) || 0,
            measurementDays: parseInt(cond.medicao) || 0,
            paymentNfDays: parseInt(cond.prazoNF) || 0,
            validityDays: parseInt(cond.validade) || 0,
            executionPeriod: cond.prazoExec,
            paymentTerms: cond.formaPagamento,
            observations: cond.obs
          }
        }
      },
      include: {
        items: true,
        conditions: true
      }
    })

    return proposal
  })

  fastify.put('/:id', async function (request, reply) {
    const { id } = request.params
    const { cliente, clientName, items, cond, propNum, title, value, status, metadata } = request.body

    try {
      // 1. Limpa relações existentes para evitar duplicidade ou órfãos
      await fastify.prisma.proposalItem.deleteMany({ where: { proposalId: id } })
      await fastify.prisma.commercialConditions.deleteMany({ where: { proposalId: id } })

      // 2. Se for Armazém (via metadata)
      if (metadata) {
        return await fastify.prisma.proposal.update({
          where: { id },
          data: {
            number: propNum || metadata.numeroProposta,
            title: title || metadata.objeto,
            clientName: clientName || metadata.cliente,
            clientContact: metadata.contato || '',
            location: metadata.local || '',
            object: metadata.objeto || '',
            total: parseFloat(value) || parseFloat(metadata.totalGeral) || 0,
            status: status || 'DRAFT',
            metadata: metadata
          }
        })
      }

      // 3. Se for Proposta Padrão
      const total = items.reduce((s, i) => s + (parseFloat(i.qty) || 0) * (parseFloat(i.price) || 0), 0)
      
      return await fastify.prisma.proposal.update({
        where: { id },
        data: {
          number: propNum,
          clientName: cliente.nome,
          clientContact: cliente.contato,
          clientRole: cliente.cargo,
          location: cliente.local,
          phone: cliente.tel,
          object: cliente.objeto,
          total: total,
          status: status || 'DRAFT',
          items: {
            create: items.map(it => ({
              catalogId: it.id,
              label: it.label,
              unit: it.unit,
              quantity: parseFloat(it.qty) || 0,
              unitPrice: parseFloat(it.price) || 0,
              subtotal: (parseFloat(it.qty) || 0) * (parseFloat(it.price) || 0)
            }))
          },
          conditions: {
            create: {
              downPayment: parseFloat(cond.entrada) || 0,
              downPaymentDays: parseInt(cond.prazoEntrada) || 0,
              measurementDays: parseInt(cond.medicao) || 0,
              paymentNfDays: parseInt(cond.prazoNF) || 0,
              validityDays: parseInt(cond.validade) || 0,
              executionPeriod: cond.prazoExec,
              paymentTerms: cond.formaPagamento,
              observations: cond.obs
            }
          }
        },
        include: {
          items: true,
          conditions: true
        }
      })
    } catch (error) {
      console.error('Erro ao atualizar proposta:', error)
      return reply.code(400).send({ error: 'Falha ao atualizar proposta', details: error.message })
    }
  })
}
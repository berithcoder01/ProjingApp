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

    const isArmazem = metadata && metadata.tipo === 'armazem'

    if (isArmazem) {
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

    // Proposal padrão ou material: usa items[] + persiste metadata (quando houver)
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
        metadata: metadata || undefined,
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
            downPaymentOnStart: cond.downPaymentOnStart === true,
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

      const isArmazem = metadata && metadata.tipo === 'armazem'

      // 2. Se for Armazém (via metadata.tipo === 'armazem')
      if (isArmazem) {
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

      // 3. Proposta Padrão OU Material: usa items[] + metadata opcional
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
          metadata: metadata || undefined,
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
              downPaymentOnStart: cond.downPaymentOnStart === true,
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

  fastify.delete('/:id', async function (request, reply) {
    const { id } = request.params
    try {
      // 1. Remove dependências (o schema não tem onDelete: Cascade)
      await fastify.prisma.proposalItem.deleteMany({ where: { proposalId: id } })
      await fastify.prisma.commercialConditions.deleteMany({ where: { proposalId: id } })
      // 2. Remove a proposta
      await fastify.prisma.proposal.delete({ where: { id } })
      return reply.code(204).send()
    } catch (error) {
      request.log.error(error)
      if (error.code === 'P2025') return reply.code(404).send({ error: 'Proposta não encontrada' })
      return reply.code(500).send({ error: 'Erro ao deletar proposta' })
    }
  })

  fastify.post('/:id/duplicate', async function (request, reply) {
    const { id } = request.params
    try {
      const original = await fastify.prisma.proposal.findUnique({
        where: { id },
        include: { items: true, conditions: true }
      })
      if (!original) return reply.code(404).send({ error: 'Proposta não encontrada' })

      // Gera novo número (formato do front: 001-NN/AA)
      const now = new Date()
      const ano = now.getFullYear().toString().slice(-2)
      const random = String(Math.floor(Math.random() * 99) + 1).padStart(2, '0')
      const novoNumero = `001-${random}/${ano}`

      const isArmazem = original.metadata && original.metadata.tipo === 'armazem'

      if (isArmazem) {
        // Armazém: só clona o registro + metadata (não usa items/conditions)
        const copia = await fastify.prisma.proposal.create({
          data: {
            number: novoNumero,
            title: original.title,
            clientName: original.clientName,
            clientContact: original.clientContact,
            clientRole: original.clientRole,
            location: original.location,
            phone: original.phone,
            object: original.object,
            total: original.total,
            status: 'DRAFT',
            metadata: {
              ...original.metadata,
              numeroProposta: novoNumero
            },
            clientId: original.clientId
          }
        })
        return copia
      }

      // Padrão/Material: clona registro + items + conditions
      const metadataClone = original.metadata
        ? { ...original.metadata, numeroProposta: novoNumero }
        : original.metadata
      const copia = await fastify.prisma.proposal.create({
        data: {
          number: novoNumero,
          title: original.title,
          clientName: original.clientName,
          clientContact: original.clientContact,
          clientRole: original.clientRole,
          location: original.location,
          phone: original.phone,
          object: original.object,
          total: original.total,
          status: 'DRAFT',
          metadata: metadataClone,
          clientId: original.clientId,
          items: {
            create: original.items.map(it => ({
              catalogId: it.catalogId,
              label: it.label,
              unit: it.unit,
              quantity: it.quantity,
              unitPrice: it.unitPrice,
              subtotal: it.subtotal
            }))
          },
          conditions: original.conditions ? {
            create: {
              downPayment: original.conditions.downPayment,
              downPaymentDays: original.conditions.downPaymentDays,
              downPaymentOnStart: original.conditions.downPaymentOnStart,
              measurementDays: original.conditions.measurementDays,
              paymentNfDays: original.conditions.paymentNfDays,
              validityDays: original.conditions.validityDays,
              executionPeriod: original.conditions.executionPeriod,
              paymentTerms: original.conditions.paymentTerms,
              observations: original.conditions.observations
            }
          } : undefined
        },
        include: { items: true, conditions: true }
      })
      return copia
    } catch (error) {
      request.log.error(error)
      return reply.code(500).send({ error: 'Erro ao duplicar proposta', details: error.message })
    }
  })
}
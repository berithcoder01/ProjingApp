export default async function clientRoutes(fastify, options) {
  // GET /api/clients - Lista todos os clientes
  fastify.get('/', async (request, reply) => {
    try {
      const clients = await fastify.prisma.client.findMany({
        orderBy: { name: 'asc' }
      });
      return clients;
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Erro ao buscar clientes.' });
    }
  });

  // POST /api/clients - Cria um novo cliente
  fastify.post('/', async (request, reply) => {
    try {
      const { name, contact, role, location, phone } = request.body;

      if (!name || !contact || !location) {
        return reply.code(400).send({ error: 'Nome, contato e local são obrigatórios.' });
      }

      const newClient = await fastify.prisma.client.create({
        data: {
          name,
          contact,
          role,
          location,
          phone
        }
      });

      return reply.code(201).send(newClient);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Erro ao criar cliente.' });
    }
  });

  // DELETE /api/clients/:id - Remove um cliente
  fastify.delete('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      await fastify.prisma.client.delete({
        where: { id }
      });
      return reply.code(204).send();
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ error: 'Erro ao deletar cliente.' });
    }
  });
}

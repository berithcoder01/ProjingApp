import path from 'node:path'
import AutoLoad from '@fastify/autoload'
import fjwt from '@fastify/jwt'
import cors from '@fastify/cors'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function (fastify, opts) {
  // CORS removido daqui - Controlado via vercel.json para maior compatibilidade mobile


  // Register JWT plugin
  fastify.register(fjwt, {
    secret: process.env.JWT_SECRET || 'super-secret'
  })

  // Decorator to protect routes
  fastify.decorate('authenticate', async function (request, reply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  // Global hook to protect routes
  fastify.addHook('onRequest', async (request, reply) => {
    // Exclude login, register routes and public assets
    if (request.url.includes('/auth/login') || request.url.includes('/auth/register') || request.url === '/' || request.url.startsWith('/public')) {
      return
    }
    
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })

  // This loads all plugins defined in plugins
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'plugins'),
    options: Object.assign({}, opts)
  })

  // This loads all plugins defined in routes
  fastify.register(AutoLoad, {
    dir: path.join(__dirname, 'routes'),
    options: Object.assign({}, opts)
  })
}
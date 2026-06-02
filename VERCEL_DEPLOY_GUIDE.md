# Guia de Configuração Vercel (Fastify + React + Capacitor)

Este guia documenta a configuração ideal para projetos que utilizam um backend Fastify (Node.js) e um frontend React (Vite), com suporte a chamadas nativas de Android/iOS via Capacitor.

## 1. Estrutura do Projeto
O projeto deve seguir a estrutura de pastas:
- `/api`: Backend Fastify
- `/app`: Frontend React/Vite
- `vercel.json`: Na raiz do projeto (crucial para o roteamento)

## 2. Configuração do vercel.json (O Coração do Deploy)
Este arquivo resolve problemas de CORS e roteamento de API.

```json
{
  "version": 2,
  "builds": [
    { "src": "api/index.js", "use": "@vercel/node" },
    { "src": "app/package.json", "use": "@vercel/static-build", "config": { "distDir": "dist" } }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "api/index.js",
      "headers": {
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,OPTIONS,PATCH,DELETE,POST,PUT",
        "Access-Control-Allow-Headers": "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization"
      }
    },
    {
      "src": "/(.*)",
      "dest": "app/$1",
      "check": true
    },
    {
      "src": "/(.*)",
      "status": 200,
      "dest": "app/index.html"
    }
  ]
}
```

## 3. Adaptação do Backend (Fastify)
Para o Fastify rodar no Vercel, ele **não deve** usar `app.listen()`. Em vez disso, exporte a instância como um handler:

```javascript
// api/index.js
const fastify = require('fastify')({ logger: true });

// Registro de rotas e plugins...

// IMPORTANTE: Para o Vercel
module.exports = async (req, res) => {
  await fastify.ready();
  fastify.server.emit('request', req, res);
};
```

## 4. Variáveis de Ambiente (Dashboard Vercel)
Configure as seguintes variáveis no painel da Vercel:
- `DATABASE_URL`: String de conexão do PostgreSQL.
- `JWT_SECRET`: Chave secreta para autenticação.

## 5. Resolução de Problemas de CORS (Android/Capacitor)
O Capacitor no Android usa a origem `http://localhost`. O Vercel bloqueia isso por padrão. 
- **Solução:** Os headers definidos no `vercel.json` acima permitem que qualquer origem (`*`) acesse a API, o que é essencial para o funcionamento do app nativo.

## 6. Build da API com Prisma
Se usar Prisma, adicione o seguinte ao `package.json` da `/api`:
```json
"scripts": {
  "vercel-build": "prisma generate && prisma migrate deploy"
}
```

## 7. Comando de Deploy
Sempre use o comando na raiz para garantir que ambos os projetos sejam processados:
```bash
vercel --prod
```

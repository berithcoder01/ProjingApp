# 🏗️ Arquitetura Base para Novo SaaS (Android Nativo)

Este documento descreve a estrutura técnica e a stack de tecnologias otimizada para o desenvolvimento de um novo SaaS escalável, utilizando como base a engenharia aplicada no projeto atual.

## 🚀 Stack de Tecnologias

### Backend (API)
- **Node.js + Fastify**: Framework de altíssima performance, focado em baixo overhead e escalabilidade.
- **Prisma ORM**: Camada de abstração de banco de dados (Type-safe) que facilita migrações e consultas complexas.
- **PostgreSQL**: Banco de dados relacional robusto para garantir a integridade dos dados.
- **Zod**: Validação de esquemas e dados de entrada com tipagem estática.
- **JWT (JSON Web Tokens)**: Autenticação stateless com sistema de Refresh Tokens persistidos para maior segurança.

### Frontend & Mobile (App)
- **React (Vite)**: Biblioteca moderna para construção de interfaces reativas e rápidas.
- **Capacitor (Ionic Team)**: Camada de integração nativa que transforma a aplicação web em um App Android nativo (.apk / .aab), permitindo acesso a APIs do dispositivo.
- **Tailwind CSS**: Estilização baseada em utilitários para criação de interfaces premium com rapidez.
- **Lucide React**: Biblioteca de ícones modernos e leves.
- **Framer Motion**: Motor de animações para proporcionar uma experiência de uso fluida e nativa.

## 📁 Estrutura do Projeto (Monorepo)

```text
/api                # Servidor Backend
  ├── prisma/       # Modelagem do Banco (Schema)
  ├── src/
  │   ├── features/ # Módulos de negócio isolados
  │   ├── middlewares/ # Segurança, Logs, Validação
  │   ├── lib/      # Clientes globais (Prisma, etc)
  │   └── server.ts # Ponto de entrada Fastify
/app                # Aplicação Frontend & Android
  ├── android/      # Código nativo Android (Gerado pelo Capacitor)
  ├── src/
  │   ├── features/ # Componentes e telas por função
  │   ├── shared/   # Hooks, components e utilitários globais
  │   └── router/   # Gestão de navegação
  ├── capacitor.config.ts # Configurações nativas do App
  └── package.json
```

## 🛡️ Modelo de Segurança

1.  **Rate Limiting**: Proteção global contra ataques de força bruta e DDoS na API.
2.  **RBAC (Role-Based Access Control)**: Controle de acesso baseado em perfis de usuário (Ex: Admin, Usuário, Visualizador) injetado diretamente no token de acesso.
3.  **Gestão de Sessão**: Revogação de tokens de acesso através de lista negra ou conferência de Refresh Tokens ativos no banco de dados.
4.  **Audit Log**: Registro de atividades críticas do sistema para conformidade e rastreabilidade.

## 📱 Estratégia Android Nativo

Para o novo SaaS, a utilização do **Capacitor** permite:
- Manter uma única base de código para Web e Android.
- Gerar um projeto nativo no Android Studio para builds de produção.
- Performance de UI próxima ao nativo puro devido ao uso de hardware acceleration no WebView moderno.
- Facilidade de deploy na Google Play Store.

---
*Este documento serve como guia de engenharia para o novo empreendimento, focando em robustez e velocidade de lançamento (Time-to-Market).*

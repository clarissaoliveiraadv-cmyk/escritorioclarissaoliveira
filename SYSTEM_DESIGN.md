# SYSTEM DESIGN — Escritório Clarissa Oliveira Advocacia

## 1. Visão Geral

Este documento descreve a arquitetura e o design do sistema do site
institucional e portal de atendimento do escritório **Clarissa Oliveira
Advocacia**. O objetivo é oferecer presença digital profissional, captação de
clientes e um canal seguro de comunicação entre o escritório e seus
constituintes.

## 2. Objetivos

- Apresentar o escritório, suas áreas de atuação e a equipe.
- Permitir que potenciais clientes solicitem contato/consulta inicial.
- Disponibilizar conteúdo jurídico (artigos, notícias) com SEO otimizado.
- Oferecer (em fase futura) área restrita para clientes acompanharem
  processos e documentos.

## 3. Personas

| Persona | Descrição | Necessidades |
|---|---|---|
| Visitante | Pessoa pesquisando serviços jurídicos | Encontrar informações claras, contato rápido |
| Cliente | Pessoa com processo em andamento | Acompanhar andamento, trocar documentos com segurança |
| Administrador | Equipe do escritório | Publicar conteúdo, gerenciar leads e clientes |

## 4. Arquitetura de Alto Nível

```
┌────────────┐     HTTPS      ┌──────────────────┐
│  Browser   │ ─────────────► │   Frontend Web   │
│ (Cliente)  │ ◄───────────── │  (SPA/SSR)       │
└────────────┘                └────────┬─────────┘
                                       │ REST/JSON
                                       ▼
                              ┌──────────────────┐
                              │   API Backend    │
                              │ (Node.js / etc.) │
                              └────────┬─────────┘
                                       │
                ┌──────────────────────┼──────────────────────┐
                ▼                      ▼                      ▼
        ┌───────────────┐     ┌────────────────┐     ┌────────────────┐
        │  Banco Dados  │     │  Armazenamento │     │  Serviços de   │
        │ (PostgreSQL)  │     │  de Arquivos   │     │  E-mail/SMS    │
        └───────────────┘     └────────────────┘     └────────────────┘
```

## 5. Componentes

### 5.1 Frontend
- **Stack sugerida:** Next.js (React) com renderização híbrida (SSG para
  páginas institucionais e SSR para conteúdo dinâmico).
- **Estilo:** Tailwind CSS, design responsivo mobile-first.
- **Acessibilidade:** WCAG 2.1 nível AA.
- **SEO:** metadados, sitemap.xml, dados estruturados (Schema.org `LegalService`).

### 5.2 Backend / API
- **Stack sugerida:** Node.js (NestJS) ou alternativa em Python (FastAPI).
- **Autenticação:** JWT + refresh tokens; MFA opcional para administradores.
- **Camadas:**
  - Controllers (HTTP)
  - Services (regras de negócio)
  - Repositories (acesso a dados)
- **Validação:** schemas (Zod / class-validator) em todas as entradas externas.

### 5.3 Banco de Dados
- **PostgreSQL** como banco relacional principal.
- Entidades iniciais: `User`, `Lead`, `Article`, `PracticeArea`, `Case`,
  `Document`.
- Migrações versionadas (Prisma / TypeORM / Alembic).

### 5.4 Armazenamento de Arquivos
- Bucket S3-compatível para documentos e imagens.
- URLs assinadas com expiração curta para acesso a documentos sensíveis.

### 5.5 Comunicações
- E-mail transacional via provedor (Resend/SendGrid).
- Notificação opcional por WhatsApp Business API para confirmações de
  agendamento.

## 6. Modelo de Dados (visão inicial)

```
User(id, name, email, password_hash, role, created_at)
Lead(id, name, email, phone, message, source, status, created_at)
PracticeArea(id, slug, title, description, icon)
Article(id, slug, title, body_md, author_id, published_at, tags)
Case(id, client_id, title, status, court, opened_at)
Document(id, case_id, name, storage_key, uploaded_by, uploaded_at)
```

## 7. Fluxos Principais

### 7.1 Captação de Lead
1. Visitante preenche formulário de contato.
2. Frontend valida e envia para `POST /api/leads`.
3. API valida, persiste em `Lead` e dispara e-mail para a equipe.
4. Visitante recebe confirmação.

### 7.2 Publicação de Artigo
1. Administrador autentica no painel.
2. Cria/edita artigo em Markdown.
3. Pré-visualiza e publica; conteúdo é regenerado estaticamente (ISR).

### 7.3 Área do Cliente (fase futura)
1. Cliente faz login com MFA.
2. Visualiza casos vinculados e documentos disponíveis.
3. Pode enviar arquivos; equipe é notificada.

## 8. Segurança

- HTTPS obrigatório (HSTS).
- Hash de senhas com Argon2id.
- Rate limiting em endpoints públicos (formulário, login).
- Proteção contra CSRF, XSS e injeção SQL (ORM parametrizado).
- Logs de auditoria para ações administrativas.
- Conformidade com a **LGPD**: política de privacidade, base legal para
  tratamento de dados, canal para titulares exercerem direitos, prazos de
  retenção definidos.
- Sigilo profissional: documentos em pastas com controle estrito de acesso.

## 9. Observabilidade

- **Logs estruturados** (JSON) centralizados.
- **Métricas** (latência, taxa de erro, throughput).
- **Tracing** distribuído nas chamadas internas.
- **Alertas** para falhas em formulários e indisponibilidade do site.

## 10. Implantação

- Frontend e API hospedados em provedor com CDN global (Vercel / AWS).
- Banco gerenciado (RDS / Neon / Supabase).
- Pipeline CI/CD: lint → testes → build → deploy em preview → deploy em produção.
- Backups diários do banco com retenção de 30 dias.

## 11. Ambientes

| Ambiente | Finalidade | URL |
|---|---|---|
| Local | Desenvolvimento | `http://localhost:3000` |
| Staging | Homologação | `staging.exemplo.com` |
| Produção | Público | `clarissaoliveira.adv.br` |

## 12. Roadmap

- **Fase 1 — MVP institucional:** páginas estáticas, formulário de contato,
  blog, SEO básico.
- **Fase 2 — Conteúdo e captação:** painel administrativo, automação de
  e-mails, integração com CRM.
- **Fase 3 — Área do cliente:** autenticação, acompanhamento de processos,
  troca segura de documentos.
- **Fase 4 — Integrações:** consulta processual em tribunais, assinatura
  eletrônica, agendamento online.

## 13. Riscos e Mitigações

| Risco | Mitigação |
|---|---|
| Vazamento de dados sensíveis | Criptografia em repouso e em trânsito; acesso mínimo; auditoria |
| Indisponibilidade do site | CDN, monitoramento, ambiente redundante |
| Conteúdo desatualizado | Revisão editorial trimestral |
| Não conformidade com LGPD | Revisão jurídica periódica; DPO designado |

## 14. Decisões em Aberto

- Escolha definitiva do stack backend (Node vs. Python).
- Provedor de hospedagem (Vercel + Neon vs. AWS).
- CMS embutido vs. headless (ex.: Sanity, Strapi).
- Necessidade real de área de cliente já no MVP.

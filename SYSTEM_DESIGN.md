# SYSTEM DESIGN — Sistema Jurídico de Execução de Prazos

> Documento de design alinhado às diretrizes em [`CLAUDE.md`](./CLAUDE.md).
> Este sistema é **ativo**: reage a atrasos, prioriza automaticamente e
> guia a equipe pelo que é mais crítico.

---

## 1. Visão Geral

Sistema de execução de prazos jurídicos para o escritório
**Clarissa Oliveira Advocacia**. O foco não é registrar tarefas — é
**garantir que prazos não sejam perdidos**, priorizando automaticamente
o trabalho crítico e atribuindo responsabilidade clara a cada item.

### Não-objetivos

- Não é um CRM.
- Não é um repositório de processos completos.
- Não substitui o sistema oficial de tribunais.

---

## 2. Princípios

1. **Ativo, não passivo** — o sistema calcula prioridade e reage a atrasos.
2. **Toda tarefa tem dono, prazo e status válido** — invariante obrigatório.
3. **Regra crítica vive no banco** — Supabase/Postgres concentra a lógica.
4. **Clareza operacional** — uma tela principal mostra o que importa hoje.
5. **Rastreabilidade total** — toda mudança relevante é registrada em log.

---

## 3. Stack

| Camada | Escolha | Justificativa |
|---|---|---|
| Banco / Backend | **Supabase (Postgres + RLS + Realtime)** | Lógica centralizada, autenticação e tempo real prontos |
| API | PostgREST (via Supabase) + Edge Functions para tarefas agendadas | Reduz código de servidor; regras vivem no banco |
| Frontend | Next.js (React) + TypeScript | SSR/ISR para painel; tipagem forte |
| Estilo | Tailwind CSS | Iteração rápida e consistência |
| Auth | Supabase Auth | Integrado a RLS |
| Agendamento | `pg_cron` + Edge Function | Recalcular criticalidade e disparar alertas |

---

## 4. Modelo de Dados

### 4.1 Tabela `tasks` (principal)

| Campo | Tipo | Restrição |
|---|---|---|
| `id` | `uuid` | PK, default `gen_random_uuid()` |
| `titulo` | `text` | `NOT NULL`, length > 0 |
| `tipo` | `task_tipo` (enum) | `NOT NULL` — `prazo` \| `audiencia` \| `tarefa` |
| `status` | `task_status` (enum) | `NOT NULL`, default `pendente` |
| `prazo` | `timestamptz` | `NOT NULL` |
| `responsavel_id` | `uuid` | `NOT NULL`, FK → `users.id` |
| `criticalidade` | `int` | calculado por função/trigger; `NOT NULL` |
| `descricao` | `text` | opcional |
| `processo_id` | `uuid` | opcional, FK → `processos.id` |
| `created_at` | `timestamptz` | default `now()` |
| `updated_at` | `timestamptz` | atualizado por trigger |

**Invariantes:**

- `responsavel_id IS NOT NULL` — sem dono, sem tarefa.
- `prazo IS NOT NULL`.
- `status` restrito ao enum.
- `criticalidade` é calculado, nunca informado pelo cliente.

### 4.2 Enums

```sql
CREATE TYPE task_tipo AS ENUM ('prazo', 'audiencia', 'tarefa');

CREATE TYPE task_status AS ENUM (
  'pendente',
  'em_andamento',
  'aguardando',
  'revisao',
  'pronto_protocolo',
  'finalizado',
  'cancelado'
);
```

### 4.3 Tabelas auxiliares

- `users(id, nome, email, papel, ativo)`
- `processos(id, numero_cnj, cliente, vara, status)` — opcional
- `task_logs(id, task_id, evento, dados_antes jsonb, dados_depois jsonb, ator_id, criado_em)` — auditoria

---

## 5. Cálculo de Criticalidade

Pontuação inteira calculada por função SQL `task_criticalidade(...)`:

| Condição | Peso |
|---|---|
| `status` finalizado/cancelado | retorna `0` (não entra no cálculo) |
| Prazo vencido (`prazo < now()`) | `+100` (máxima) |
| Prazo hoje | `+90` |
| Prazo em até 2 dias | `+60` |
| Prazo em até 7 dias | `+30` |
| Tipo `prazo` | `+20` |
| Tipo `audiencia` | `+10` |
| Tipo `tarefa` | `+0` |

A função é determinística e roda:

- em **trigger** `BEFORE INSERT/UPDATE` em `tasks` (recalcula ao gravar);
- em **job agendado** (`pg_cron` a cada 15 min) que recalcula linhas
  potencialmente afetadas pelo passar do tempo.

---

## 6. Triggers e Funções

| Objeto | Tipo | Função |
|---|---|---|
| `task_criticalidade(tipo, prazo, status)` | `FUNCTION` | retorna `int` |
| `tg_tasks_set_criticalidade` | `TRIGGER BEFORE INSERT/UPDATE` | preenche `criticalidade` e `updated_at` |
| `tg_tasks_audit` | `TRIGGER AFTER INSERT/UPDATE/DELETE` | grava em `task_logs` |
| `recalcular_criticalidade_global()` | `FUNCTION` | usado pelo cron |
| `cron.schedule('recalc', '*/15 * * * *', ...)` | `pg_cron` | reexecuta o cálculo |

---

## 7. View `foco_do_dia` (tela principal)

```sql
CREATE OR REPLACE VIEW foco_do_dia AS
SELECT
  t.id,
  t.titulo,
  t.tipo,
  t.status,
  t.prazo,
  t.responsavel_id,
  t.criticalidade
FROM tasks t
WHERE t.status NOT IN ('finalizado', 'cancelado')
  AND (
        t.prazo <= (now() + interval '2 days')
        OR t.criticalidade >= 60
      )
ORDER BY t.criticalidade DESC, t.prazo ASC;
```

Esta view alimenta a **tela inicial** do sistema. Toda a equipe começa o
dia por ela.

---

## 8. Segurança (RLS)

- RLS ativado em todas as tabelas.
- `tasks`:
  - `SELECT` permitido para usuários ativos do escritório.
  - `INSERT/UPDATE` exigem que `responsavel_id IS NOT NULL`.
  - `UPDATE` de `criticalidade` bloqueado para clientes — apenas trigger.
- `task_logs`: somente leitura para gestores; escrita só via trigger.
- Senhas, autenticação e MFA via Supabase Auth.

---

## 9. Escalonamento (preparação)

Estrutura prevista (não obrigatória no MVP):

- Tabela `alertas(task_id, nivel, enviado_em, canal)`.
- Edge Function `verificar_atrasos`:
  - executa a cada hora;
  - emite alerta nível 1 ao vencer, nível 2 após 24h, nível 3 com cópia
    para o gestor após 48h.
- Canais previstos: e-mail, WhatsApp Business, push web.

---

## 10. Frontend

- Tela `/foco-do-dia` (default após login) — consome a view homônima.
- Tela `/tarefas` — lista completa com filtros (status, responsável, tipo).
- Tela `/tarefa/:id` — detalhe + histórico (de `task_logs`).
- Componentes destacam visualmente:
  - vencidas (vermelho),
  - hoje (laranja),
  - próximas 48h (amarelo).
- **Sem regra crítica no frontend**: ele apenas lê e exibe.

---

## 11. Observabilidade e Logs

- `task_logs` registra todas as alterações relevantes em `tasks`.
- Métricas-chave:
  - tarefas vencidas por responsável,
  - tempo médio entre criação e finalização,
  - taxa de tarefas em `pronto_protocolo` no prazo.

---

## 12. Roadmap

| Fase | Entrega |
|---|---|
| **1 — Núcleo** | Tabela `tasks`, enums, trigger de criticalidade, view `foco_do_dia`, CRUD básico no painel |
| **2 — Auditoria** | `task_logs`, histórico no detalhe da tarefa |
| **3 — Escalonamento** | Alertas progressivos por e-mail/WhatsApp |
| **4 — Integrações** | Importar prazos do PJe/eproc; assinatura eletrônica |

---

## 13. Decisões em Aberto

- Pesos finais da função de criticalidade (validar com a equipe).
- Granularidade do `task_logs` (todos os campos ou apenas os críticos?).
- Política de retenção de tarefas finalizadas/canceladas.
- Origem dos prazos: digitação manual, importação, ou ambos.

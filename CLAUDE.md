# SISTEMA JURÍDICO — DIRETRIZES DE DESENVOLVIMENTO

## OBJETIVO

Este sistema não é apenas um gerenciador de tarefas.
Ele deve ser um sistema orientado à execução de prazos jurídicos, com foco em:

- evitar perda de prazo
- priorizar automaticamente tarefas críticas
- garantir responsabilização
- permitir rastreabilidade completa

---

## PRINCÍPIOS DE ARQUITETURA

1. O sistema deve ser ATIVO, não passivo
   - deve reagir a atrasos
   - deve priorizar automaticamente

2. Nenhuma tarefa pode existir sem:
   - responsável
   - prazo
   - status válido

3. O sistema deve sempre favorecer:
   - clareza operacional
   - redução de decisões humanas

---

## MODELAGEM DE TAREFAS

Tabela principal: `tasks`

Campos obrigatórios:

- id
- titulo
- tipo (`prazo` | `audiencia` | `tarefa`)
- status
- prazo
- responsavel_id
- criticalidade (calculada)
- created_at
- updated_at

---

## STATUS PERMITIDOS

- `pendente`
- `em_andamento`
- `aguardando`
- `revisao`
- `pronto_protocolo`
- `finalizado`
- `cancelado`

Não permitir valores fora desta lista.

---

## LÓGICA DE PRIORIDADE (CRITICALIDADE)

A prioridade deve ser calculada automaticamente com base em:

- prazos vencidos → prioridade máxima
- prazo hoje → prioridade máxima
- próximos 2 dias → alta prioridade
- tipo: `prazo` > `audiencia` > `tarefa`

Tarefas finalizadas ou canceladas não entram no cálculo.

---

## REGRAS DE BANCO (OBRIGATÓRIO)

- usar funções SQL para cálculo de criticalidade
- usar triggers para atualização automática
- impedir registros sem responsável
- registrar alterações relevantes (log)

---

## VISÕES PRINCIPAIS

Criar view obrigatória:

### `foco_do_dia`

Critérios:

- tarefas não finalizadas
- prazo `<= hoje + 2 dias` OU alta criticalidade
- ordenado por criticalidade desc

Essa deve ser a principal tela do sistema.

---

## ESCALONAMENTO (PREPARAÇÃO)

Sistema deve permitir futuramente:

- notificação de atraso
- alerta progressivo
- intervenção do gestor

---

## PADRÕES DE DESENVOLVIMENTO

- evitar lógica crítica no frontend
- centralizar regras no banco (Supabase)
- escrever código limpo e previsível
- sempre retornar código completo (não parcial)

---

## REGRAS PARA COMMITS AUTOMÁTICOS

Claude deve:

1. Nunca quebrar estrutura existente
2. Sempre explicar mudanças no commit
3. Criar código funcional (pronto para rodar)
4. Evitar duplicação de lógica
5. Priorizar simplicidade e robustez

---

## OBJETIVO FINAL

Transformar este sistema em um mecanismo confiável de execução jurídica, onde:

- prazos não são esquecidos
- tarefas são automaticamente priorizadas
- equipe é guiada pelo sistema

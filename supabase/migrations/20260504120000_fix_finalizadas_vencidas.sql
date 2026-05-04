-- =============================================================
-- Bug fix: tarefas/compromissos concluídos ainda apareciam como
-- vencidos/atrasados no dashboard e na pasta do cliente.
--
-- Sintoma:
--   - tarefas marcadas como `finalizado` (ou `cancelado`) com prazo
--     no passado continuavam contadas em /dashboard ("Vencidas",
--     "Críticas") e listadas em /foco-do-dia.
--
-- Causa raiz:
--   - public.recalcular_criticalidade_global() (cron a cada 15 min)
--     pulava explicitamente tarefas finalizadas/canceladas. Qualquer
--     linha cujo trigger tg_tasks_set_criticalidade não tenha rodado
--     no caminho que mudou o status (importação direta, migração de
--     dados, edição em SQL, alteração antes da existência do trigger)
--     ficava com criticalidade antiga (>= 60) — e a view foco_do_dia
--     inclui linhas via "OR t.criticalidade >= 60", o que mantinha a
--     tarefa "viva" mesmo após concluída.
--   - Não havia invariante de domínio garantindo que finalizada
--     ⇒ criticalidade = 0, então o estado inconsistente se perpetuava.
--
-- Correção (defesa em profundidade):
--   1. Backfill imediato: zera criticalidade de todas as
--      finalizadas/canceladas que estavam com valor não-zero.
--   2. CHECK constraint: garante a invariante no banco
--      (status finalizado/cancelado ⇒ criticalidade = 0).
--   3. recalcular_criticalidade_global: passa a normalizar TODAS as
--      linhas (inclui finalizadas/canceladas), de modo que qualquer
--      desvio futuro converge para 0 em até 15 minutos.
-- =============================================================

-- 1. Backfill ----------------------------------------------------
update public.tasks
set    criticalidade = 0
where  status in ('finalizado', 'cancelado')
  and  criticalidade <> 0;

-- 2. Invariante de domínio --------------------------------------
alter table public.tasks
  drop constraint if exists tasks_finalizada_zero_criticalidade;

alter table public.tasks
  add constraint tasks_finalizada_zero_criticalidade
  check (
    status not in ('finalizado', 'cancelado')
    or criticalidade = 0
  );

-- 3. Normalização global (inclui finalizadas/canceladas) ---------
create or replace function public.recalcular_criticalidade_global()
returns integer
language plpgsql
as $$
declare
  v_count integer;
begin
  update public.tasks t
  set    criticalidade = public.task_criticalidade(t.tipo, t.prazo, t.status)
  where  t.criticalidade is distinct from
         public.task_criticalidade(t.tipo, t.prazo, t.status);

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

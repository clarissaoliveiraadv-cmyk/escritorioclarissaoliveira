-- =============================================================
-- Cálculo de criticalidade, trigger e view foco_do_dia
-- =============================================================

-- ----------------------------------------------------------------
-- Função pura(stable) que calcula a pontuação de criticalidade.
-- Pesos:
--   prazo vencido       → 100
--   prazo hoje          →  90
--   prazo até 2 dias    →  60
--   prazo até 7 dias    →  30
--   tipo prazo          → +20
--   tipo audiência      → +10
--   tipo tarefa         →  +0
-- Tarefas finalizadas/canceladas retornam 0.
-- ----------------------------------------------------------------

create or replace function public.task_criticalidade(
  p_tipo public.task_tipo,
  p_prazo timestamptz,
  p_status public.task_status
) returns integer
language plpgsql
stable
as $$
declare
  v_prazo_score integer := 0;
  v_tipo_score integer := 0;
begin
  if p_status in ('finalizado', 'cancelado') then
    return 0;
  end if;

  if p_prazo < now() then
    v_prazo_score := 100;
  elsif (p_prazo at time zone 'America/Sao_Paulo')::date
        = (now()  at time zone 'America/Sao_Paulo')::date then
    v_prazo_score := 90;
  elsif p_prazo <= now() + interval '2 days' then
    v_prazo_score := 60;
  elsif p_prazo <= now() + interval '7 days' then
    v_prazo_score := 30;
  else
    v_prazo_score := 0;
  end if;

  v_tipo_score := case p_tipo
    when 'prazo' then 20
    when 'audiencia' then 10
    when 'tarefa' then 0
  end;

  return v_prazo_score + v_tipo_score;
end;
$$;

-- ----------------------------------------------------------------
-- Trigger BEFORE INSERT/UPDATE: preenche criticalidade e updated_at.
-- Cliente nunca define criticalidade — vive no banco.
-- ----------------------------------------------------------------

create or replace function public.tg_tasks_set_criticalidade()
returns trigger
language plpgsql
as $$
begin
  new.criticalidade := public.task_criticalidade(new.tipo, new.prazo, new.status);
  new.updated_at := now();
  return new;
end;
$$;

create trigger tasks_set_criticalidade
before insert or update on public.tasks
for each row
execute function public.tg_tasks_set_criticalidade();

-- ----------------------------------------------------------------
-- Recálculo global usado pelo cron (a cada 15 min).
-- Atualiza apenas linhas em que o valor muda, para minimizar
-- escrita e ruído em auditoria.
-- ----------------------------------------------------------------

create or replace function public.recalcular_criticalidade_global()
returns integer
language plpgsql
as $$
declare
  v_count integer;
begin
  update public.tasks t
  set criticalidade = public.task_criticalidade(t.tipo, t.prazo, t.status)
  where t.status not in ('finalizado', 'cancelado')
    and t.criticalidade is distinct from
        public.task_criticalidade(t.tipo, t.prazo, t.status);

  get diagnostics v_count = row_count;
  return v_count;
end;
$$;

-- ----------------------------------------------------------------
-- View foco_do_dia — tela principal do sistema.
-- ----------------------------------------------------------------

create or replace view public.foco_do_dia as
select
  t.id,
  t.titulo,
  t.tipo,
  t.status,
  t.prazo,
  t.responsavel_id,
  u.nome as responsavel_nome,
  t.criticalidade,
  case
    when t.prazo < now() then 'vencido'
    when (t.prazo at time zone 'America/Sao_Paulo')::date
         = (now()    at time zone 'America/Sao_Paulo')::date then 'hoje'
    when t.prazo <= now() + interval '2 days' then 'proximo'
    else 'futuro'
  end as urgencia
from public.tasks t
left join public.users u on u.id = t.responsavel_id
where t.status not in ('finalizado', 'cancelado')
  and (
        t.prazo <= now() + interval '2 days'
        or t.criticalidade >= 60
      )
order by t.criticalidade desc, t.prazo asc;

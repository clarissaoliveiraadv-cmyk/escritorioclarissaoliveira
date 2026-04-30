-- =============================================================
-- Adiciona campos para a tela /foco-do-dia:
--   - processos.pasta_url   (link OneDrive da pasta do processo)
--   - tasks.cliente         (cliente quando a tarefa não tem processo)
--   - tasks.pasta_url       (link específico da tarefa, sobrescreve o do processo)
-- E recria a view foco_do_dia expondo cliente e pasta_url resolvidos.
-- =============================================================

alter table public.processos add column if not exists pasta_url text;
alter table public.tasks     add column if not exists cliente   text;
alter table public.tasks     add column if not exists pasta_url text;

drop view if exists public.foco_do_dia;

create view public.foco_do_dia as
select
  t.id,
  t.titulo,
  coalesce(p.cliente, t.cliente)    as cliente,
  t.tipo,
  t.status,
  t.prazo,
  t.responsavel_id,
  u.nome                             as responsavel_nome,
  t.criticalidade,
  coalesce(t.pasta_url, p.pasta_url) as pasta_url,
  case
    when t.prazo < now() then 'vencido'
    when (t.prazo at time zone 'America/Sao_Paulo')::date
         = (now()    at time zone 'America/Sao_Paulo')::date then 'hoje'
    when t.prazo <= now() + interval '2 days' then 'proximo'
    else 'futuro'
  end as urgencia
from public.tasks t
left join public.users     u on u.id = t.responsavel_id
left join public.processos p on p.id = t.processo_id
where t.status not in ('finalizado', 'cancelado')
  and (
        t.prazo <= now() + interval '2 days'
        or t.criticalidade >= 60
      )
order by t.criticalidade desc, t.prazo asc;

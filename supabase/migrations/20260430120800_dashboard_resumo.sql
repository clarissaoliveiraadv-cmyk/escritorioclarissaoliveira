-- =============================================================
-- View dashboard_resumo
--
-- Uma única linha com colunas suficientes para todos os blocos
-- do /dashboard. Listas (cards 2.1, 2.5, 2.6) são retornadas
-- como jsonb agregado para evitar lógica no frontend.
--
-- security_invoker = on: garante que a RLS dos objetos base
-- (tasks, users, processos) seja avaliada com o role do
-- chamador. Usuário inativo ou sem sessão recebe linha zerada
-- / arrays vazios automaticamente.
--
-- Evolução futura (filtros por período e responsável): trocar a
-- view por uma SQL function que receba esses parâmetros e
-- retorne a mesma forma. Toda a lógica continua no banco.
-- =============================================================

-- updated_at é usado em "sem movimentação" (cards 2.4); cobre o
-- único campo do dashboard ainda sem índice.
create index if not exists tasks_updated_at_idx
  on public.tasks (updated_at);

drop view if exists public.dashboard_resumo;

create view public.dashboard_resumo
with (security_invoker = on)
as
select
  -- ---------- 2.1 Vencidas: total + lista por responsável -----------
  (
    select count(*)::int
    from public.tasks t
    where t.prazo < now()
      and t.status not in ('finalizado', 'cancelado')
  ) as vencidas_total,

  (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'responsavel_id',   x.responsavel_id,
          'responsavel_nome', x.responsavel_nome,
          'qtd',              x.qtd
        )
        order by x.qtd desc
      ),
      '[]'::jsonb
    )
    from (
      select
        u.id   as responsavel_id,
        u.nome as responsavel_nome,
        count(*)::int as qtd
      from public.tasks t
      join public.users u
        on u.id = t.responsavel_id
       and u.ativo                       -- não expõe inativos
      where t.prazo < now()
        and t.status not in ('finalizado', 'cancelado')
      group by u.id, u.nome
    ) x
  ) as vencidas_por_responsavel,

  -- ---------- 2.2 Vence hoje (timezone SP) --------------------------
  (
    select count(*)::int
    from public.tasks t
    where (t.prazo at time zone 'America/Sao_Paulo')::date
        = (now()    at time zone 'America/Sao_Paulo')::date
      and t.status not in ('finalizado', 'cancelado')
  ) as hoje_total,

  -- ---------- 2.3 Críticas (próx 2 dias e criticalidade >= 60) -----
  (
    select count(*)::int
    from public.tasks t
    where t.prazo <= now() + interval '2 days'
      and t.criticalidade >= 60
      and t.status not in ('finalizado', 'cancelado')
  ) as criticas_total,

  -- ---------- 2.4 Sem movimentação (updated_at < now() - 3d) -------
  (
    select count(*)::int
    from public.tasks t
    where t.updated_at < now() - interval '3 days'
      and t.status not in ('finalizado', 'cancelado')
  ) as paradas_total,

  -- ---------- 2.5 Carga ativa por responsável ----------------------
  (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'responsavel_id',   x.responsavel_id,
          'responsavel_nome', x.responsavel_nome,
          'qtd',              x.qtd
        )
        order by x.qtd desc
      ),
      '[]'::jsonb
    )
    from (
      select
        u.id   as responsavel_id,
        u.nome as responsavel_nome,
        count(*)::int as qtd
      from public.tasks t
      join public.users u
        on u.id = t.responsavel_id
       and u.ativo
      where t.status not in ('finalizado', 'cancelado')
      group by u.id, u.nome
    ) x
  ) as carga_por_responsavel,

  -- ---------- 2.6 Top 5 clientes (mais ativas) ---------------------
  (
    select coalesce(
      jsonb_agg(
        jsonb_build_object(
          'cliente', x.cliente,
          'qtd',     x.qtd
        )
        order by x.qtd desc
      ),
      '[]'::jsonb
    )
    from (
      select
        coalesce(p.cliente, t.cliente) as cliente,
        count(*)::int as qtd
      from public.tasks t
      left join public.processos p on p.id = t.processo_id
      where t.status not in ('finalizado', 'cancelado')
        and coalesce(p.cliente, t.cliente) is not null
      group by coalesce(p.cliente, t.cliente)
      order by count(*) desc
      limit 5
    ) x
  ) as top_clientes;

grant select on public.dashboard_resumo to authenticated;

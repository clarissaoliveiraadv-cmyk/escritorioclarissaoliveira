-- =============================================================
-- Row Level Security
-- Toda escrita em tasks exige usuário ativo e responsável.
-- task_logs é read-only via API; a escrita acontece pelo trigger
-- (SECURITY DEFINER), nunca pelo cliente.
-- =============================================================

alter table public.users      enable row level security;
alter table public.processos  enable row level security;
alter table public.tasks      enable row level security;
alter table public.task_logs  enable row level security;

-- ----------------------------------------------------------------
-- Helper: o usuário autenticado é um membro ativo do escritório?
-- ----------------------------------------------------------------

create or replace function public.is_usuario_ativo()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select ativo from public.users where id = auth.uid()),
    false
  );
$$;

-- ----------------------------------------------------------------
-- users
-- ----------------------------------------------------------------

create policy users_select_ativos
on public.users for select
to authenticated
using (public.is_usuario_ativo());

create policy users_update_self
on public.users for update
to authenticated
using (id = auth.uid())
with check (id = auth.uid());

-- ----------------------------------------------------------------
-- processos
-- ----------------------------------------------------------------

create policy processos_select_ativos
on public.processos for select
to authenticated
using (public.is_usuario_ativo());

create policy processos_write_ativos
on public.processos for all
to authenticated
using (public.is_usuario_ativo())
with check (public.is_usuario_ativo());

-- ----------------------------------------------------------------
-- tasks
-- ----------------------------------------------------------------

create policy tasks_select_ativos
on public.tasks for select
to authenticated
using (public.is_usuario_ativo());

create policy tasks_insert_ativos
on public.tasks for insert
to authenticated
with check (
  public.is_usuario_ativo()
  and responsavel_id is not null
);

create policy tasks_update_ativos
on public.tasks for update
to authenticated
using (public.is_usuario_ativo())
with check (
  public.is_usuario_ativo()
  and responsavel_id is not null
);

create policy tasks_delete_ativos
on public.tasks for delete
to authenticated
using (public.is_usuario_ativo());

-- ----------------------------------------------------------------
-- task_logs: leitura para usuários ativos; escrita apenas via
-- trigger SECURITY DEFINER (sem policy de write → bloqueado ao cliente).
-- ----------------------------------------------------------------

create policy task_logs_select_ativos
on public.task_logs for select
to authenticated
using (public.is_usuario_ativo());

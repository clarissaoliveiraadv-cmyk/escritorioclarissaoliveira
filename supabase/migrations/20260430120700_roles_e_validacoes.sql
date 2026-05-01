-- =============================================================
-- Roles + validações de equipe
--
-- Objetivos:
--  - introduzir public.users.role ('membro' | 'admin') com default
--    'membro';
--  - criar helper is_admin() para RLS e triggers;
--  - permitir alteração de ativo / role somente para admin;
--  - impedir que tarefas sejam atribuídas a usuários inativos.
-- =============================================================

-- -------------------------------------------------------------
-- 1. Coluna role com check
-- -------------------------------------------------------------

alter table public.users
  add column if not exists role text not null default 'membro';

alter table public.users
  drop constraint if exists users_role_check;

alter table public.users
  add constraint users_role_check check (role in ('membro', 'admin'));

create index if not exists users_role_idx on public.users (role);

-- -------------------------------------------------------------
-- 2. Helper is_admin()
--    SECURITY DEFINER para atravessar a RLS de public.users e
--    evitar recursão de policy.
-- -------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (select role = 'admin' and ativo
       from public.users
       where id = auth.uid()),
    false
  );
$$;

-- -------------------------------------------------------------
-- 3. Policy: admin pode atualizar qualquer linha de users
--    (a policy users_update_self continua válida e permite ao
--    usuário comum mexer em campos próprios não protegidos).
-- -------------------------------------------------------------

drop policy if exists users_update_admin on public.users;

create policy users_update_admin
on public.users for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

-- -------------------------------------------------------------
-- 4. Trigger: protege ativo e role contra alterações por
--    usuários comuns. Contexto sem auth (migrations, dashboard,
--    seeds) é tratado como confiável.
-- -------------------------------------------------------------

create or replace function public.tg_users_protect_admin_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- contexto administrativo (sem JWT): permitido
  if auth.uid() is null then
    return new;
  end if;

  -- admin: permitido
  if public.is_admin() then
    return new;
  end if;

  if new.ativo is distinct from old.ativo then
    raise exception 'Apenas administradores podem alterar o status ativo.'
      using errcode = '42501';
  end if;

  if new.role is distinct from old.role then
    raise exception 'Apenas administradores podem alterar o papel.'
      using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists users_protect_admin_fields on public.users;

create trigger users_protect_admin_fields
before update on public.users
for each row
execute function public.tg_users_protect_admin_fields();

-- -------------------------------------------------------------
-- 5. Trigger em tasks: impede atribuir tarefa a usuário inativo.
--    Dispara em INSERT (sempre) e em UPDATE OF responsavel_id.
--    Tarefas existentes apontando para um usuário desativado
--    continuam editáveis em outros campos — só não podem ser
--    reatribuídas a um inativo.
-- -------------------------------------------------------------

create or replace function public.tg_tasks_validate_responsavel()
returns trigger
language plpgsql
as $$
declare
  v_ativo boolean;
begin
  select ativo into v_ativo
    from public.users
    where id = new.responsavel_id;

  if not coalesce(v_ativo, false) then
    raise exception
      'Responsável inválido ou inativo: %', new.responsavel_id
      using errcode = '23514';
  end if;

  return new;
end;
$$;

drop trigger if exists tasks_validate_responsavel on public.tasks;

create trigger tasks_validate_responsavel
before insert or update of responsavel_id on public.tasks
for each row
execute function public.tg_tasks_validate_responsavel();

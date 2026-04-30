-- =============================================================
-- Criação automática de perfil em public.users a cada novo
-- registro em auth.users (Supabase Auth).
--
-- Antes: o perfil precisava ser inserido manualmente após o
-- primeiro login por magic-link, e a RLS bloqueava o usuário
-- até a intervenção do gestor.
-- Depois: o perfil é criado pelo banco (SECURITY DEFINER), com
-- ativo = true, sem nenhuma dependência de frontend.
-- =============================================================

-- -------------------------------------------------------------
-- 1. nome agora é nullable.
--    O trigger só conhece o e-mail (e, opcionalmente, o nome
--    em raw_user_meta_data). O usuário completa o cadastro
--    depois.
-- -------------------------------------------------------------

alter table public.users
  alter column nome drop not null;

-- -------------------------------------------------------------
-- 2. Função que cria o perfil correspondente à conta de auth.
--    - SECURITY DEFINER: roda como o owner (postgres) e
--      atravessa a RLS de public.users.
--    - search_path fixo: blindagem contra ataques de path.
--    - on conflict (id) do nothing: idempotente; nunca duplica.
-- -------------------------------------------------------------

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.users (id, email, nome, ativo, created_at)
  values (
    new.id,
    new.email,
    coalesce(
      new.raw_user_meta_data->>'nome',
      new.raw_user_meta_data->>'name',
      new.raw_user_meta_data->>'full_name'
    ),
    true,
    coalesce(new.created_at, now())
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- -------------------------------------------------------------
-- 3. Trigger AFTER INSERT em auth.users.
--    drop if exists garante reexecução segura da migration.
-- -------------------------------------------------------------

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row
execute function public.handle_new_auth_user();

-- -------------------------------------------------------------
-- 4. Backfill: cria perfil para usuários de auth pré-existentes
--    que ainda não tenham linha em public.users (idempotente
--    pelo not exists).
-- -------------------------------------------------------------

insert into public.users (id, email, nome, ativo, created_at)
select
  au.id,
  au.email,
  coalesce(
    au.raw_user_meta_data->>'nome',
    au.raw_user_meta_data->>'name',
    au.raw_user_meta_data->>'full_name'
  ),
  true,
  coalesce(au.created_at, now())
from auth.users au
where not exists (
  select 1 from public.users pu where pu.id = au.id
);

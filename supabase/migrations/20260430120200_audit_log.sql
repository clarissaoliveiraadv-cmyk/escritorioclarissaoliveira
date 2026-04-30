-- =============================================================
-- Auditoria de tarefas — task_logs
-- Toda alteração relevante em tasks é registrada via trigger.
-- =============================================================

create table public.task_logs (
  id uuid primary key default gen_random_uuid(),
  task_id uuid not null,
  evento text not null check (evento in ('criada', 'atualizada', 'removida')),
  dados_antes jsonb,
  dados_depois jsonb,
  ator_id uuid,
  criado_em timestamptz not null default now()
);

create index task_logs_task_id_idx
  on public.task_logs (task_id, criado_em desc);

-- ----------------------------------------------------------------
-- Trigger AFTER INSERT/UPDATE/DELETE em tasks → grava em task_logs.
-- SECURITY DEFINER para conseguir gravar mesmo com RLS ativo.
-- ----------------------------------------------------------------

create or replace function public.tg_tasks_audit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ator uuid;
begin
  begin
    v_ator := auth.uid();
  exception when others then
    v_ator := null;
  end;

  if tg_op = 'INSERT' then
    insert into public.task_logs (task_id, evento, dados_antes, dados_depois, ator_id)
    values (new.id, 'criada', null, to_jsonb(new), v_ator);
    return new;

  elsif tg_op = 'UPDATE' then
    if to_jsonb(new) is distinct from to_jsonb(old) then
      insert into public.task_logs (task_id, evento, dados_antes, dados_depois, ator_id)
      values (new.id, 'atualizada', to_jsonb(old), to_jsonb(new), v_ator);
    end if;
    return new;

  elsif tg_op = 'DELETE' then
    insert into public.task_logs (task_id, evento, dados_antes, dados_depois, ator_id)
    values (old.id, 'removida', to_jsonb(old), null, v_ator);
    return old;
  end if;

  return null;
end;
$$;

create trigger tasks_audit
after insert or update or delete on public.tasks
for each row
execute function public.tg_tasks_audit();

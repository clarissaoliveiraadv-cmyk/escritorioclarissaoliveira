-- =============================================================
-- Seed para desenvolvimento local (supabase db reset).
-- NÃO usar em produção.
-- =============================================================

-- Cria um usuário de auth fake e perfil correspondente.
-- Em produção, o registro vem do fluxo de Supabase Auth.

insert into auth.users (id, email)
values ('00000000-0000-0000-0000-000000000001', 'clarissa@exemplo.adv.br')
on conflict (id) do nothing;

insert into public.users (id, nome, email, papel, ativo)
values (
  '00000000-0000-0000-0000-000000000001',
  'Clarissa Oliveira',
  'clarissa@exemplo.adv.br',
  'gestor',
  true
)
on conflict (id) do nothing;

-- Tarefas de exemplo cobrindo cada faixa de criticalidade.
insert into public.tasks (titulo, tipo, status, prazo, responsavel_id) values
  ('Contestação — proc. 0001', 'prazo',     'pendente',     now() - interval '1 day',  '00000000-0000-0000-0000-000000000001'),
  ('Audiência de instrução',    'audiencia', 'em_andamento', now(),                     '00000000-0000-0000-0000-000000000001'),
  ('Réplica — proc. 0002',      'prazo',     'pendente',     now() + interval '1 day',  '00000000-0000-0000-0000-000000000001'),
  ('Petição intermediária',     'tarefa',    'pendente',     now() + interval '5 days', '00000000-0000-0000-0000-000000000001'),
  ('Memoriais — proc. 0003',    'prazo',     'pendente',     now() + interval '20 days','00000000-0000-0000-0000-000000000001'),
  ('Arquivamento concluído',    'tarefa',    'finalizado',   now() - interval '3 days', '00000000-0000-0000-0000-000000000001');

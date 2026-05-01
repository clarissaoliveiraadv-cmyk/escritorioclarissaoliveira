-- =============================================================
-- Seed para desenvolvimento local (supabase db reset).
-- NÃO usar em produção.
--
-- Observação: a inserção em auth.users dispara o trigger
-- on_auth_user_created, que cria o perfil em public.users com
-- ativo=true e role='membro'. Em seguida, fazemos UPSERT para
-- ajustar nome / papel / role. O trigger users_protect_admin_fields
-- detecta auth.uid() = null em contexto de seed e permite a alteração.
-- =============================================================

-- ---- Contas de auth ----------------------------------------------

insert into auth.users (id, email) values
  ('00000000-0000-0000-0000-000000000001', 'clarissa@exemplo.adv.br'),
  ('00000000-0000-0000-0000-000000000002', 'membro@exemplo.adv.br'),
  ('00000000-0000-0000-0000-000000000003', 'inativo@exemplo.adv.br')
on conflict (id) do nothing;

-- ---- Perfis em public.users (upsert para sobrescrever defaults) --

insert into public.users (id, nome, email, papel, role, ativo) values
  ('00000000-0000-0000-0000-000000000001', 'Clarissa Oliveira', 'clarissa@exemplo.adv.br', 'gestor',     'admin',  true),
  ('00000000-0000-0000-0000-000000000002', 'João Silva',         'membro@exemplo.adv.br',   'advogado',   'membro', true),
  ('00000000-0000-0000-0000-000000000003', 'Maria Antiga',       'inativo@exemplo.adv.br',  'estagiario', 'membro', false)
on conflict (id) do update set
  nome  = excluded.nome,
  papel = excluded.papel,
  role  = excluded.role,
  ativo = excluded.ativo;

-- ---- Tarefas de exemplo ------------------------------------------

insert into public.tasks (titulo, cliente, pasta_url, tipo, status, prazo, responsavel_id) values
  ('Contestação — proc. 0001', 'Souza & Cia. Ltda.', 'https://1drv.ms/f/exemplo-souza',  'prazo',     'pendente',     now() - interval '1 day',  '00000000-0000-0000-0000-000000000001'),
  ('Audiência de instrução',   'Maria das Dores',    'https://1drv.ms/f/exemplo-mdores', 'audiencia', 'em_andamento', now(),                     '00000000-0000-0000-0000-000000000002'),
  ('Réplica — proc. 0002',     'Construtora Lima',   'https://1drv.ms/f/exemplo-lima',   'prazo',     'pendente',     now() + interval '1 day',  '00000000-0000-0000-0000-000000000001'),
  ('Petição intermediária',    'João Pereira',        null,                              'tarefa',    'pendente',     now() + interval '5 days', '00000000-0000-0000-0000-000000000002'),
  ('Memoriais — proc. 0003',   'Banco Aurora S/A',   'https://1drv.ms/f/exemplo-aurora', 'prazo',     'pendente',     now() + interval '20 days','00000000-0000-0000-0000-000000000001'),
  ('Arquivamento concluído',   'Cliente antigo',      null,                              'tarefa',    'finalizado',   now() - interval '3 days', '00000000-0000-0000-0000-000000000001');

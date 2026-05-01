-- =============================================================
-- Correção de segurança: aplicar security_invoker = on à view
-- foco_do_dia, alinhando ao padrão de dashboard_resumo.
--
-- Motivo: views em PostgreSQL rodam por padrão como o owner
-- (postgres no Supabase, que tem BYPASSRLS). Sem
-- security_invoker, a RLS de tasks/users/processos é
-- ignorada quando a view é consultada — usuários inativos
-- e qualquer authenticated com GRANT enxergavam linhas que
-- a RLS deveria esconder.
--
-- Validado localmente em PG 16: query "select count(*) from
-- public.foco_do_dia" como usuário inativo retornava 3 antes
-- e retorna 0 depois.
-- =============================================================

alter view public.foco_do_dia set (security_invoker = on);

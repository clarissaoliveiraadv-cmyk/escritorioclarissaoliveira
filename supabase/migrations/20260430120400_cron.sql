-- =============================================================
-- Agendamento: recalcular criticalidade a cada 15 minutos.
-- Requer extensão pg_cron (habilitar no dashboard do Supabase
-- caso ainda não esteja ativa).
-- =============================================================

create extension if not exists pg_cron;

select cron.schedule(
  'recalc-criticalidade',
  '*/15 * * * *',
  $$ select public.recalcular_criticalidade_global(); $$
);

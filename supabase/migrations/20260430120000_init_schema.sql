-- =============================================================
-- Sistema Jurídico — Fase 1
-- Schema inicial: extensões, enums e tabelas base.
-- Referências: CLAUDE.md, SYSTEM_DESIGN.md
-- =============================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------
-- Enums
-- ----------------------------------------------------------------

create type public.task_tipo as enum ('prazo', 'audiencia', 'tarefa');

create type public.task_status as enum (
  'pendente',
  'em_andamento',
  'aguardando',
  'revisao',
  'pronto_protocolo',
  'finalizado',
  'cancelado'
);

-- ----------------------------------------------------------------
-- Perfil de usuário (vinculado a auth.users do Supabase)
-- ----------------------------------------------------------------

create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text not null,
  email text not null unique,
  papel text not null default 'advogado',
  ativo boolean not null default true,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- Processos (opcional, para vincular tarefas a um caso)
-- ----------------------------------------------------------------

create table public.processos (
  id uuid primary key default gen_random_uuid(),
  numero_cnj text unique,
  cliente text,
  vara text,
  status text,
  created_at timestamptz not null default now()
);

-- ----------------------------------------------------------------
-- Tasks — tabela principal do sistema
-- Invariantes: toda tarefa tem responsável, prazo e status válido.
-- ----------------------------------------------------------------

create table public.tasks (
  id uuid primary key default gen_random_uuid(),
  titulo text not null check (length(trim(titulo)) > 0),
  tipo public.task_tipo not null,
  status public.task_status not null default 'pendente',
  prazo timestamptz not null,
  responsavel_id uuid not null references public.users(id),
  criticalidade integer not null default 0,
  descricao text,
  processo_id uuid references public.processos(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index tasks_prazo_idx on public.tasks (prazo);
create index tasks_status_idx on public.tasks (status);
create index tasks_responsavel_idx on public.tasks (responsavel_id);
create index tasks_criticalidade_idx on public.tasks (criticalidade desc);
create index tasks_processo_idx on public.tasks (processo_id);

export type TaskTipo = "prazo" | "audiencia" | "tarefa";

export const TASK_TIPOS: TaskTipo[] = ["prazo", "audiencia", "tarefa"];

export type TaskStatus =
  | "pendente"
  | "em_andamento"
  | "aguardando"
  | "revisao"
  | "pronto_protocolo"
  | "finalizado"
  | "cancelado";

export const TASK_STATUSES: TaskStatus[] = [
  "pendente",
  "em_andamento",
  "aguardando",
  "revisao",
  "pronto_protocolo",
  "finalizado",
  "cancelado",
];

export type Urgencia = "vencido" | "hoje" | "proximo" | "futuro";

export interface FocoDoDiaItem {
  id: string;
  titulo: string;
  cliente: string | null;
  tipo: TaskTipo;
  status: TaskStatus;
  prazo: string;
  responsavel_id: string;
  responsavel_nome: string | null;
  criticalidade: number;
  pasta_url: string | null;
  urgencia: Urgencia;
}

export interface Task {
  id: string;
  titulo: string;
  tipo: TaskTipo;
  status: TaskStatus;
  prazo: string;
  responsavel_id: string;
  criticalidade: number;
  descricao: string | null;
  processo_id: string | null;
  cliente: string | null;
  pasta_url: string | null;
  created_at: string;
  updated_at: string;
}

export type Role = "membro" | "admin";

export interface UsuarioRef {
  id: string;
  nome: string | null;
  ativo: boolean;
}

export interface UsuarioAdmin {
  id: string;
  nome: string | null;
  email: string;
  role: Role;
  ativo: boolean;
  created_at: string;
}

export interface TaskLog {
  id: string;
  task_id: string;
  evento: "criada" | "atualizada" | "removida";
  dados_antes: Record<string, unknown> | null;
  dados_depois: Record<string, unknown> | null;
  ator_id: string | null;
  criado_em: string;
}

export const TIPO_LABEL: Record<TaskTipo, string> = {
  prazo: "Prazo",
  audiencia: "Audiência",
  tarefa: "Tarefa",
};

export const STATUS_LABEL: Record<TaskStatus, string> = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  aguardando: "Aguardando",
  revisao: "Em revisão",
  pronto_protocolo: "Pronto p/ protocolo",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
};

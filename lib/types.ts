export type TaskTipo = "prazo" | "audiencia" | "tarefa";

export type TaskStatus =
  | "pendente"
  | "em_andamento"
  | "aguardando"
  | "revisao"
  | "pronto_protocolo"
  | "finalizado"
  | "cancelado";

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

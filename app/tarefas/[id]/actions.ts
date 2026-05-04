"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { TaskStatus, TaskTipo } from "@/lib/types";

export interface AtualizarTarefaInput {
  titulo: string;
  tipo: TaskTipo;
  status: TaskStatus;
  prazo: string; // ISO 8601
  responsavel_id: string;
}

export interface AtualizarTarefaResult {
  ok: boolean;
  error?: string;
}

/**
 * Atualiza a tarefa. A regra crítica vive no banco:
 *   - enums validam tipo/status,
 *   - NOT NULL valida responsavel_id,
 *   - trigger recalcula criticalidade e updated_at,
 *   - trigger de auditoria grava em task_logs com auth.uid().
 */
export async function atualizarTarefa(
  id: string,
  input: AtualizarTarefaInput,
): Promise<AtualizarTarefaResult> {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from("tasks")
    .update({
      titulo: input.titulo,
      tipo: input.tipo,
      status: input.status,
      prazo: input.prazo,
      responsavel_id: input.responsavel_id,
    })
    .eq("id", id);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath(`/tarefas/${id}`);
  revalidatePath("/foco-do-dia");
  revalidatePath("/dashboard");

  return { ok: true };
}

"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export interface ToggleAtivoResult {
  ok: boolean;
  error?: string;
}

/**
 * Alterna ativo/inativo de um usuário. A regra crítica vive no banco:
 *   - policy users_update_admin exige is_admin();
 *   - trigger users_protect_admin_fields bloqueia não-admin que tente
 *     mexer em ativo;
 *   - trigger tasks_validate_responsavel impede atribuir tarefa a
 *     usuário inativo.
 */
export async function toggleAtivo(
  userId: string,
  novoAtivo: boolean,
): Promise<ToggleAtivoResult> {
  const supabase = createSupabaseServerClient();

  const { error } = await supabase
    .from("users")
    .update({ ativo: novoAtivo })
    .eq("id", userId);

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/usuarios");
  revalidatePath("/foco-do-dia");
  return { ok: true };
}

import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Task, TaskLog, UsuarioRef } from "@/lib/types";
import { EditarTarefaForm } from "./EditarTarefaForm";
import { Historico } from "./Historico";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function TarefaPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [tarefaRes, logsRes, usuariosRes] = await Promise.all([
    supabase
      .from("tasks")
      .select("*")
      .eq("id", params.id)
      .maybeSingle<Task>(),
    supabase
      .from("task_logs")
      .select("*")
      .eq("task_id", params.id)
      .order("criado_em", { ascending: false })
      .returns<TaskLog[]>(),
    supabase
      .from("users")
      .select("id, nome, ativo")
      .order("nome")
      .returns<UsuarioRef[]>(),
  ]);

  if (tarefaRes.error || !tarefaRes.data) {
    if (tarefaRes.error?.code === "PGRST116") notFound();
    if (!tarefaRes.data) notFound();
  }

  const tarefa = tarefaRes.data!;
  const logs = logsRes.data ?? [];
  const todosUsuarios = usuariosRes.data ?? [];
  const usuariosAtivos = todosUsuarios.filter((u) => u.ativo);

  const usuariosMap = new Map<string, UsuarioRef>(
    todosUsuarios.map((u) => [u.id, u]),
  );

  return (
    <main className="mx-auto max-w-3xl p-6">
      <Link
        href="/foco-do-dia"
        className="text-sm text-slate-500 hover:text-slate-900"
      >
        ← Foco do dia
      </Link>

      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        Editar tarefa
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Criticalidade atual:{" "}
        <span className="font-semibold">{tarefa.criticalidade}</span> · última
        atualização:{" "}
        {new Intl.DateTimeFormat("pt-BR", {
          timeZone: "America/Sao_Paulo",
          dateStyle: "short",
          timeStyle: "short",
        }).format(new Date(tarefa.updated_at))}
      </p>

      <section className="mt-6 rounded-lg border border-slate-200 bg-slate-50 p-5">
        <EditarTarefaForm tarefa={tarefa} usuarios={usuariosAtivos} />
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
          Histórico ({logs.length})
        </h2>
        <Historico logs={logs} usuarios={usuariosMap} />
      </section>
    </main>
  );
}

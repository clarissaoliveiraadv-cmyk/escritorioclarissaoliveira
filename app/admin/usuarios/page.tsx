import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { UsuarioAdmin } from "@/lib/types";
import { UsuariosTable } from "./UsuariosTable";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function UsuariosPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: meu } = await supabase
    .from("users")
    .select("role, ativo")
    .eq("id", user.id)
    .maybeSingle<{ role: string; ativo: boolean }>();

  const isAdmin = meu?.ativo === true && meu?.role === "admin";

  if (!isAdmin) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <Link
          href="/foco-do-dia"
          className="text-sm text-slate-500 hover:text-slate-900"
        >
          ← Foco do dia
        </Link>
        <h1 className="mt-2 text-2xl font-semibold">Acesso restrito</h1>
        <p className="mt-2 text-slate-600">
          Esta área é exclusiva para administradores.
        </p>
      </main>
    );
  }

  const { data: usuarios, error } = await supabase
    .from("users")
    .select("id, nome, email, role, ativo, created_at")
    .order("nome", { nullsFirst: false })
    .returns<UsuarioAdmin[]>();

  if (error) {
    return (
      <main className="mx-auto max-w-3xl p-6">
        <h1 className="text-2xl font-semibold">Equipe / Usuários</h1>
        <p className="mt-4 text-red-700">Erro ao carregar: {error.message}</p>
      </main>
    );
  }

  const total = usuarios?.length ?? 0;
  const ativos = usuarios?.filter((u) => u.ativo).length ?? 0;

  return (
    <main className="mx-auto max-w-4xl p-6">
      <Link
        href="/foco-do-dia"
        className="text-sm text-slate-500 hover:text-slate-900"
      >
        ← Foco do dia
      </Link>

      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        Equipe / Usuários
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        {total} usuário(s) · {ativos} ativo(s)
      </p>

      <div className="mt-6">
        <UsuariosTable usuarios={usuarios ?? []} />
      </div>
    </main>
  );
}

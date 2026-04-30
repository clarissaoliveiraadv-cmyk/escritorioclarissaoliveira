import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { FocoDoDiaItem, TaskStatus, TaskTipo, Urgencia } from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const STATUS_LABEL: Record<TaskStatus, string> = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  aguardando: "Aguardando",
  revisao: "Em revisão",
  pronto_protocolo: "Pronto p/ protocolo",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
};

const TIPO_LABEL: Record<TaskTipo, string> = {
  prazo: "Prazo",
  audiencia: "Audiência",
  tarefa: "Tarefa",
};

const GRUPO_ORDEM: Urgencia[] = ["vencido", "hoje", "proximo"];

const GRUPO_LABEL: Record<Urgencia, string> = {
  vencido: "Vencidos",
  hoje: "Vence hoje",
  proximo: "Próximos 2 dias",
  futuro: "Futuros",
};

const GRUPO_ESTILO: Record<Urgencia, string> = {
  vencido: "border-red-300 bg-red-50",
  hoje: "border-orange-300 bg-orange-50",
  proximo: "border-amber-200 bg-amber-50",
  futuro: "border-slate-200 bg-white",
};

const GRUPO_BADGE: Record<Urgencia, string> = {
  vencido: "bg-red-600 text-white",
  hoje: "bg-orange-500 text-white",
  proximo: "bg-amber-500 text-white",
  futuro: "bg-slate-300 text-slate-800",
};

export default async function FocoDoDiaPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data, error } = await supabase
    .from("foco_do_dia")
    .select("*")
    .returns<FocoDoDiaItem[]>();

  if (error) {
    return (
      <main className="mx-auto max-w-4xl p-6">
        <h1 className="text-2xl font-semibold">Foco do dia</h1>
        <p className="mt-4 text-red-700">
          Erro ao carregar tarefas: {error.message}
        </p>
      </main>
    );
  }

  const items = data ?? [];
  const grupos = GRUPO_ORDEM.map((u) => ({
    urgencia: u,
    titulo: GRUPO_LABEL[u],
    items: items.filter((t) => t.urgencia === u),
  }));

  const total = grupos.reduce((acc, g) => acc + g.items.length, 0);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <header className="mb-8 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            Foco do dia
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {total === 0
              ? "Nenhuma tarefa crítica para hoje."
              : `${total} tarefa(s) exigem atenção, ordenadas por criticalidade.`}
          </p>
        </div>
      </header>

      {grupos.map((g) => (
        <section key={g.urgencia} className="mb-8">
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-slate-600">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs ${GRUPO_BADGE[g.urgencia]}`}
            >
              {g.titulo}
            </span>
            <span className="text-slate-400">({g.items.length})</span>
          </h2>

          {g.items.length === 0 ? (
            <p className="text-sm text-slate-400">— vazio —</p>
          ) : (
            <ul className="space-y-2">
              {g.items.map((t) => (
                <li
                  key={t.id}
                  className={`rounded-lg border p-4 ${GRUPO_ESTILO[t.urgencia]}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs uppercase tracking-wide text-slate-500">
                        <span className="font-semibold text-slate-700">
                          {TIPO_LABEL[t.tipo]}
                        </span>
                        <span>·</span>
                        <span>{STATUS_LABEL[t.status]}</span>
                        <span>·</span>
                        <span>crit. {t.criticalidade}</span>
                      </div>

                      <h3 className="mt-1 truncate text-base font-medium text-slate-900">
                        {t.titulo}
                      </h3>

                      <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-slate-600">
                        {t.cliente && (
                          <>
                            <span className="font-medium">{t.cliente}</span>
                            <span className="text-slate-300">|</span>
                          </>
                        )}
                        <span>Prazo: {formatPrazo(t.prazo)}</span>
                        {t.responsavel_nome && (
                          <>
                            <span className="text-slate-300">|</span>
                            <span>Resp.: {t.responsavel_nome}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {t.pasta_url ? (
                      <a
                        href={t.pasta_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 rounded-md bg-slate-900 px-3 py-1.5 text-sm font-medium text-white hover:bg-slate-700"
                      >
                        Abrir pasta
                      </a>
                    ) : (
                      <span
                        title="Pasta não vinculada"
                        className="shrink-0 cursor-not-allowed select-none rounded-md bg-slate-100 px-3 py-1.5 text-sm text-slate-400"
                      >
                        Sem pasta
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </main>
  );
}

function formatPrazo(iso: string): string {
  const d = new Date(iso);
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

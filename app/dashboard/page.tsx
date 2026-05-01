import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type {
  ClienteCarga,
  DashboardResumo,
  ResponsavelCarga,
} from "@/lib/types";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const supabase = createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: resumo, error } = await supabase
    .from("dashboard_resumo")
    .select("*")
    .maybeSingle<DashboardResumo>();

  if (error) {
    return (
      <main className="mx-auto max-w-5xl p-6">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="mt-4 text-red-700">
          Erro ao carregar: {error.message}
        </p>
      </main>
    );
  }

  const r: DashboardResumo = resumo ?? {
    vencidas_total: 0,
    vencidas_por_responsavel: [],
    hoje_total: 0,
    criticas_total: 0,
    paradas_total: 0,
    carga_por_responsavel: [],
    top_clientes: [],
  };

  return (
    <main className="mx-auto max-w-5xl p-6">
      <Link
        href="/foco-do-dia"
        className="text-sm text-slate-500 hover:text-slate-900"
      >
        ← Foco do dia
      </Link>

      <h1 className="mt-2 text-3xl font-semibold tracking-tight">
        Dashboard operacional
      </h1>
      <p className="mt-1 text-sm text-slate-600">
        Visão estratégica das tarefas em aberto.
      </p>

      <section className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <KpiCard
          tone="red"
          label="Vencidas"
          value={r.vencidas_total}
          hint="prazo < agora"
        />
        <KpiCard
          tone="orange"
          label="Vencem hoje"
          value={r.hoje_total}
          hint="prazo no dia atual"
        />
        <KpiCard
          tone="amber"
          label="Críticas (≤ 2 dias)"
          value={r.criticas_total}
          hint="criticalidade ≥ 60"
        />
        <KpiCard
          tone="blue"
          label="Sem movimentação"
          value={r.paradas_total}
          hint="updated_at > 3 dias"
        />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <Painel titulo="Vencidas por responsável" tom="red">
          <ListaResponsavel
            itens={r.vencidas_por_responsavel}
            emptyMsg="Nenhuma tarefa vencida."
          />
        </Painel>

        <Painel titulo="Carga ativa por responsável" tom="violet">
          <ListaResponsavel
            itens={r.carga_por_responsavel}
            emptyMsg="Sem tarefas ativas."
          />
        </Painel>
      </section>

      <section className="mt-6">
        <Painel titulo="Top 5 clientes (tarefas em aberto)" tom="emerald">
          <ListaCliente
            itens={r.top_clientes}
            emptyMsg="Nenhum cliente com tarefas ativas."
          />
        </Painel>
      </section>
    </main>
  );
}

// ---------- componentes inline (server) -------------------------------

const KPI_TONES = {
  red: "border-red-300 bg-red-50 text-red-900",
  orange: "border-orange-300 bg-orange-50 text-orange-900",
  amber: "border-amber-300 bg-amber-50 text-amber-900",
  blue: "border-blue-300 bg-blue-50 text-blue-900",
} as const;

function KpiCard({
  tone,
  label,
  value,
  hint,
}: {
  tone: keyof typeof KPI_TONES;
  label: string;
  value: number;
  hint: string;
}) {
  return (
    <div className={`rounded-lg border p-4 ${KPI_TONES[tone]}`}>
      <p className="text-xs font-semibold uppercase tracking-wide opacity-80">
        {label}
      </p>
      <p className="mt-1 text-3xl font-bold tabular-nums">{value}</p>
      <p className="mt-1 text-xs opacity-70">{hint}</p>
    </div>
  );
}

const PAINEL_TONES = {
  red: "border-red-200",
  violet: "border-violet-200",
  emerald: "border-emerald-200",
} as const;

function Painel({
  titulo,
  tom,
  children,
}: {
  titulo: string;
  tom: keyof typeof PAINEL_TONES;
  children: React.ReactNode;
}) {
  return (
    <div className={`rounded-lg border bg-white p-4 ${PAINEL_TONES[tom]}`}>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
        {titulo}
      </h2>
      <div className="mt-3">{children}</div>
    </div>
  );
}

function ListaResponsavel({
  itens,
  emptyMsg,
}: {
  itens: ResponsavelCarga[];
  emptyMsg: string;
}) {
  if (itens.length === 0) {
    return <p className="text-sm text-slate-400">{emptyMsg}</p>;
  }
  const max = Math.max(...itens.map((i) => i.qtd));
  return (
    <ul className="space-y-1.5">
      {itens.map((i) => (
        <li
          key={i.responsavel_id}
          className="flex items-center gap-3 text-sm"
        >
          <span className="min-w-0 flex-1 truncate text-slate-800">
            {i.responsavel_nome}
          </span>
          <span
            className="h-2 rounded bg-slate-300"
            style={{ width: `${(i.qtd / max) * 80}px` }}
            aria-hidden
          />
          <span className="w-8 text-right tabular-nums font-medium text-slate-900">
            {i.qtd}
          </span>
        </li>
      ))}
    </ul>
  );
}

function ListaCliente({
  itens,
  emptyMsg,
}: {
  itens: ClienteCarga[];
  emptyMsg: string;
}) {
  if (itens.length === 0) {
    return <p className="text-sm text-slate-400">{emptyMsg}</p>;
  }
  const max = Math.max(...itens.map((i) => i.qtd));
  return (
    <ul className="space-y-1.5">
      {itens.map((i, idx) => (
        <li
          key={`${i.cliente}-${idx}`}
          className="flex items-center gap-3 text-sm"
        >
          <span className="min-w-0 flex-1 truncate text-slate-800">
            {i.cliente}
          </span>
          <span
            className="h-2 rounded bg-emerald-300"
            style={{ width: `${(i.qtd / max) * 80}px` }}
            aria-hidden
          />
          <span className="w-8 text-right tabular-nums font-medium text-slate-900">
            {i.qtd}
          </span>
        </li>
      ))}
    </ul>
  );
}

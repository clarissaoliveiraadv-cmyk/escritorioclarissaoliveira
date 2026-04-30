import { STATUS_LABEL, TIPO_LABEL, type TaskLog, type UsuarioRef } from "@/lib/types";

interface Props {
  logs: TaskLog[];
  usuarios: Map<string, UsuarioRef>;
}

const FIELD_LABELS: Record<string, string> = {
  titulo: "Título",
  tipo: "Tipo",
  status: "Status",
  prazo: "Prazo",
  responsavel_id: "Responsável",
  criticalidade: "Criticalidade",
  descricao: "Descrição",
  processo_id: "Processo",
  cliente: "Cliente",
  pasta_url: "Pasta",
};

const CAMPOS_RASTREADOS = Object.keys(FIELD_LABELS);
const CAMPOS_CRITICOS = new Set(["status", "prazo"]);

export function Historico({ logs, usuarios }: Props) {
  if (logs.length === 0) {
    return <p className="text-sm text-slate-500">Sem registros.</p>;
  }

  return (
    <ol className="space-y-3">
      {logs.map((log) => (
        <li
          key={log.id}
          className="rounded-md border border-slate-200 bg-white p-3 text-sm"
        >
          <div className="flex flex-wrap items-baseline justify-between gap-2 text-xs text-slate-500">
            <span className="font-semibold uppercase tracking-wide text-slate-600">
              {log.evento === "criada" && "Tarefa criada"}
              {log.evento === "atualizada" && "Atualização"}
              {log.evento === "removida" && "Tarefa removida"}
            </span>
            <span>
              {formatTimestamp(log.criado_em)} ·{" "}
              {log.ator_id
                ? (usuarios.get(log.ator_id)?.nome ?? log.ator_id)
                : "sistema"}
            </span>
          </div>

          <div className="mt-2">
            {log.evento === "criada" && (
              <ValoresIniciais dados={log.dados_depois} usuarios={usuarios} />
            )}
            {log.evento === "atualizada" && (
              <Diff
                antes={log.dados_antes}
                depois={log.dados_depois}
                usuarios={usuarios}
              />
            )}
            {log.evento === "removida" && (
              <p className="text-slate-600">Registro excluído.</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  );
}

function Diff({
  antes,
  depois,
  usuarios,
}: {
  antes: Record<string, unknown> | null;
  depois: Record<string, unknown> | null;
  usuarios: Map<string, UsuarioRef>;
}) {
  if (!antes || !depois) return null;

  const linhas = CAMPOS_RASTREADOS.flatMap((campo) => {
    const a = antes[campo];
    const d = depois[campo];
    if (jsonEquals(a, d)) return [];
    return [{ campo, antes: a, depois: d }];
  });

  if (linhas.length === 0) {
    return <p className="text-slate-500">Sem alterações relevantes.</p>;
  }

  return (
    <ul className="space-y-1">
      {linhas.map(({ campo, antes, depois }) => {
        const critico = CAMPOS_CRITICOS.has(campo);
        return (
          <li
            key={campo}
            className={`flex flex-wrap items-baseline gap-2 ${
              critico ? "rounded bg-amber-50 px-2 py-1" : ""
            }`}
          >
            <span
              className={`min-w-[7rem] text-xs uppercase tracking-wide ${
                critico ? "font-bold text-amber-900" : "text-slate-500"
              }`}
            >
              {FIELD_LABELS[campo]}
            </span>
            <span className="text-slate-500 line-through">
              {renderValor(campo, antes, usuarios)}
            </span>
            <span className="text-slate-400">→</span>
            <span
              className={
                critico ? "font-semibold text-amber-900" : "text-slate-900"
              }
            >
              {renderValor(campo, depois, usuarios)}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

function ValoresIniciais({
  dados,
  usuarios,
}: {
  dados: Record<string, unknown> | null;
  usuarios: Map<string, UsuarioRef>;
}) {
  if (!dados) return null;
  return (
    <ul className="space-y-1">
      {CAMPOS_RASTREADOS.filter((c) => dados[c] != null).map((campo) => (
        <li key={campo} className="flex flex-wrap gap-2">
          <span className="min-w-[7rem] text-xs uppercase tracking-wide text-slate-500">
            {FIELD_LABELS[campo]}
          </span>
          <span className="text-slate-900">
            {renderValor(campo, dados[campo], usuarios)}
          </span>
        </li>
      ))}
    </ul>
  );
}

function renderValor(
  campo: string,
  valor: unknown,
  usuarios: Map<string, UsuarioRef>,
): string {
  if (valor == null || valor === "") return "—";

  if (campo === "tipo" && typeof valor === "string") {
    return TIPO_LABEL[valor as keyof typeof TIPO_LABEL] ?? valor;
  }
  if (campo === "status" && typeof valor === "string") {
    return STATUS_LABEL[valor as keyof typeof STATUS_LABEL] ?? valor;
  }
  if (campo === "responsavel_id" && typeof valor === "string") {
    return usuarios.get(valor)?.nome ?? valor;
  }
  if (campo === "prazo" && typeof valor === "string") {
    return formatTimestamp(valor);
  }
  return String(valor);
}

function formatTimestamp(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

function jsonEquals(a: unknown, b: unknown): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

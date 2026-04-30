"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  STATUS_LABEL,
  TASK_STATUSES,
  TASK_TIPOS,
  TIPO_LABEL,
  type Task,
  type UsuarioRef,
} from "@/lib/types";
import { atualizarTarefa } from "./actions";

interface Props {
  tarefa: Task;
  usuarios: UsuarioRef[];
}

export function EditarTarefaForm({ tarefa, usuarios }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [titulo, setTitulo] = useState(tarefa.titulo);
  const [tipo, setTipo] = useState(tarefa.tipo);
  const [status, setStatus] = useState(tarefa.status);
  const [prazoLocal, setPrazoLocal] = useState(isoToLocalInput(tarefa.prazo));
  const [responsavelId, setResponsavelId] = useState(tarefa.responsavel_id);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [savedAt, setSavedAt] = useState<number | null>(null);

  const dirty = useMemo(() => {
    return (
      titulo !== tarefa.titulo ||
      tipo !== tarefa.tipo ||
      status !== tarefa.status ||
      prazoLocal !== isoToLocalInput(tarefa.prazo) ||
      responsavelId !== tarefa.responsavel_id
    );
  }, [titulo, tipo, status, prazoLocal, responsavelId, tarefa]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg(null);

    if (!responsavelId) {
      setErrorMsg("Responsável é obrigatório.");
      return;
    }

    const prazoIso = new Date(prazoLocal).toISOString();

    startTransition(async () => {
      const result = await atualizarTarefa(tarefa.id, {
        titulo: titulo.trim(),
        tipo,
        status,
        prazo: prazoIso,
        responsavel_id: responsavelId,
      });

      if (!result.ok) {
        setErrorMsg(result.error ?? "Erro ao salvar.");
        return;
      }

      setSavedAt(Date.now());
      router.refresh();
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div>
        <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
          Título
        </label>
        <input
          type="text"
          required
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-base outline-none focus:border-slate-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Tipo
          </label>
          <select
            value={tipo}
            onChange={(e) => setTipo(e.target.value as typeof tipo)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          >
            {TASK_TIPOS.map((t) => (
              <option key={t} value={t}>
                {TIPO_LABEL[t]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
            Responsável
          </label>
          <select
            value={responsavelId}
            onChange={(e) => setResponsavelId(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
          >
            {!usuarios.some((u) => u.id === responsavelId) && (
              <option value={responsavelId}>(usuário inativo)</option>
            )}
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nome}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mudanças críticas: status e prazo destacados. */}
      <div className="grid grid-cols-1 gap-4 rounded-md border-2 border-slate-300 bg-white p-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">
            Status <span className="text-red-600">*</span>
          </label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as typeof status)}
            className="mt-1 w-full rounded-md border border-slate-400 px-3 py-2 text-base font-medium outline-none focus:border-slate-700"
          >
            {TASK_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_LABEL[s]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">
            Prazo <span className="text-red-600">*</span>
          </label>
          <input
            type="datetime-local"
            required
            value={prazoLocal}
            onChange={(e) => setPrazoLocal(e.target.value)}
            className="mt-1 w-full rounded-md border border-slate-400 px-3 py-2 text-base font-medium outline-none focus:border-slate-700"
          />
        </div>
      </div>

      {errorMsg && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMsg}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={!dirty || pending}
          className="rounded-md bg-slate-900 px-4 py-2 font-medium text-white hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {pending ? "Salvando..." : "Salvar"}
        </button>
        {savedAt && !dirty && !pending && (
          <span className="text-sm text-emerald-700">Alterações salvas.</span>
        )}
      </div>
    </form>
  );
}

function isoToLocalInput(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return (
    `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}` +
    `T${pad(d.getHours())}:${pad(d.getMinutes())}`
  );
}

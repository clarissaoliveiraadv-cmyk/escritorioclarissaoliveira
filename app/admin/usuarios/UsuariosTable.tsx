"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { UsuarioAdmin } from "@/lib/types";
import { toggleAtivo } from "./actions";

export function UsuariosTable({ usuarios }: { usuarios: UsuarioAdmin[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  function handleToggle(id: string, novoAtivo: boolean) {
    setErrorMsg(null);
    setBusyId(id);
    startTransition(async () => {
      const res = await toggleAtivo(id, novoAtivo);
      setBusyId(null);
      if (!res.ok) {
        setErrorMsg(res.error ?? "Erro ao atualizar.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <>
      {errorMsg && (
        <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {errorMsg}
        </p>
      )}

      <div className="overflow-hidden rounded-md border border-slate-200 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-3 py-2">Nome</th>
              <th className="px-3 py-2">E-mail</th>
              <th className="px-3 py-2">Papel</th>
              <th className="px-3 py-2">Status</th>
              <th className="px-3 py-2">Criado em</th>
              <th className="px-3 py-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map((u) => {
              const isBusy = pending && busyId === u.id;
              return (
                <tr key={u.id} className="border-t border-slate-100">
                  <td className="px-3 py-2 font-medium">
                    {u.nome ?? <span className="text-slate-400">—</span>}
                  </td>
                  <td className="px-3 py-2 text-slate-600">{u.email}</td>
                  <td className="px-3 py-2 text-slate-600">
                    {u.role === "admin" ? "Admin" : "Membro"}
                  </td>
                  <td className="px-3 py-2">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs ${
                        u.ativo
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-slate-200 text-slate-600"
                      }`}
                    >
                      {u.ativo ? "Ativo" : "Inativo"}
                    </span>
                  </td>
                  <td className="px-3 py-2 text-slate-600">
                    {formatTimestamp(u.created_at)}
                  </td>
                  <td className="px-3 py-2 text-right">
                    <button
                      type="button"
                      onClick={() => handleToggle(u.id, !u.ativo)}
                      disabled={isBusy}
                      className={`rounded-md px-3 py-1 text-sm font-medium ${
                        u.ativo
                          ? "bg-slate-200 text-slate-800 hover:bg-slate-300"
                          : "bg-emerald-600 text-white hover:bg-emerald-700"
                      } disabled:opacity-50`}
                    >
                      {isBusy ? "..." : u.ativo ? "Desativar" : "Ativar"}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function formatTimestamp(iso: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    dateStyle: "short",
  }).format(new Date(iso));
}

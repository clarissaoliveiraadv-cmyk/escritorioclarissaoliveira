"use client";

import { useState } from "react";
import { createBrowserClient } from "@supabase/ssr";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [errorMsg, setErrorMsg] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setErrorMsg("");

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });

    if (error) {
      setErrorMsg(error.message);
      setStatus("error");
    } else {
      setStatus("sent");
    }
  }

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="mt-12 text-2xl font-semibold">Entrar</h1>
      <p className="mt-1 text-sm text-slate-600">
        Enviaremos um link de acesso ao seu e-mail do escritório.
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-3">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="seu@escritorio.adv.br"
          className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-slate-500"
        />
        <button
          type="submit"
          disabled={status === "sending" || status === "sent"}
          className="w-full rounded-md bg-slate-900 py-2 font-medium text-white hover:bg-slate-700 disabled:opacity-50"
        >
          {status === "sending" ? "Enviando..." : "Enviar link"}
        </button>
      </form>

      {status === "sent" && (
        <p className="mt-4 text-sm text-emerald-700">
          Link enviado. Verifique seu e-mail.
        </p>
      )}
      {status === "error" && (
        <p className="mt-4 text-sm text-red-700">{errorMsg}</p>
      )}
    </main>
  );
}

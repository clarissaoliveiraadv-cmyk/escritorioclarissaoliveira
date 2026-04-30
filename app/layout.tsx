import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Escritório Clarissa Oliveira — Foco do Dia",
  description: "Sistema jurídico de execução de prazos.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen">{children}</body>
    </html>
  );
}

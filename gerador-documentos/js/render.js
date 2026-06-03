/* ===========================================================
   Renderização de documentos:
   - extração de campos {{campo}}
   - substituição de valores
   - conversão do corpo em HTML formatado
   - exportação para Word (.doc) e impressão/PDF
   =========================================================== */

window.Render = (function () {
  const FIELD_RE = /{{\s*([a-zA-Z0-9_]+)\s*}}/g;
  const BLANK = "____________";
  const BLANK_MARK = "@@BLANK@@"; // sentinela só usada na pré-visualização

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  function labelFor(campo) {
    if (window.FIELD_LABELS[campo]) return window.FIELD_LABELS[campo];
    return campo.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  }

  // Lista única de campos usados no corpo, na ordem em que aparecem.
  function extractFields(corpo) {
    const seen = new Set();
    const out = [];
    let m;
    FIELD_RE.lastIndex = 0;
    while ((m = FIELD_RE.exec(corpo)) !== null) {
      if (!seen.has(m[1])) {
        seen.add(m[1]);
        out.push(m[1]);
      }
    }
    return out;
  }

  // Substitui {{campo}} pelos valores. Campos vazios viram linha de preenchimento.
  // markBlanks=true marca os vazios para destaque na pré-visualização.
  function fill(corpo, dados, markBlanks) {
    return corpo.replace(FIELD_RE, (_, campo) => {
      const v = dados[campo];
      if (v !== undefined && v !== null && String(v).trim() !== "") {
        return String(v);
      }
      return markBlanks ? BLANK_MARK : BLANK;
    });
  }

  // Converte o texto (já preenchido) em HTML formatado para o documento.
  function toHtml(texto) {
    const html = [];
    for (const raw of texto.split("\n")) {
      const linha = raw.replace(/\s+$/, "");
      if (linha.trim() === "") { continue; }
      let tag = "p", cls = "", conteudo = linha;
      if (linha.startsWith("# ")) { tag = "h1"; conteudo = linha.slice(2); }
      else if (linha.startsWith("## ")) { tag = "h2"; conteudo = linha.slice(3); }
      else if (linha.startsWith("~ ")) { cls = "assinatura"; conteudo = linha.slice(2); }

      const safe = escapeHtml(conteudo)
        .split(BLANK_MARK).join(`<span class="blank">${BLANK}</span>`);
      html.push(`<${tag}${cls ? ` class="${cls}"` : ""}>${safe}</${tag}>`);
    }
    return html.join("\n");
  }

  // HTML para a pré-visualização (com vazios destacados).
  function previewHtml(corpo, dados) {
    return toHtml(fill(corpo, dados, true));
  }

  // Texto puro (para copiar / WhatsApp): remove marcadores de formatação.
  function plainText(corpo, dados) {
    return fill(corpo, dados, false)
      .split("\n")
      .map((l) => l.replace(/^#+\s/, "").replace(/^~\s/, ""))
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  }

  // Documento Word: HTML compatível com o Microsoft Word, salvo como .doc.
  function wordBlob(titulo, corpo, dados) {
    const body = toHtml(fill(corpo, dados, false));
    const doc = `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${escapeHtml(titulo)}</title>
<style>
  @page { margin: 2.5cm; }
  body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.5; text-align: justify; }
  h1 { font-size: 13pt; text-align: center; text-transform: uppercase; }
  h2 { font-size: 12pt; }
  p.assinatura { text-align: center; }
</style></head>
<body>${body}</body></html>`;
    return new Blob(["﻿", doc], { type: "application/msword" });
  }

  function download(blob, filename) {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  // Abre uma janela de impressão (o usuário escolhe "Salvar como PDF").
  function printDoc(titulo, corpo, dados) {
    const body = toHtml(fill(corpo, dados, false));
    const w = window.open("", "_blank");
    if (!w) { return false; }
    w.document.write(`<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8"><title>${escapeHtml(titulo)}</title>
<style>
  @page { margin: 2.5cm; }
  body { font-family: "Times New Roman", serif; font-size: 12pt; line-height: 1.6; text-align: justify; color: #000; }
  h1 { font-size: 14pt; text-align: center; text-transform: uppercase; }
  h2 { font-size: 12pt; }
  p { margin: 0 0 10px; }
  p.assinatura { text-align: center; margin-top: 30px; }
</style></head><body>${body}</body></html>`);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 300);
    return true;
  }

  function slugify(s) {
    return String(s).normalize("NFD").replace(/[̀-ͯ]/g, "")
      .replace(/[^a-zA-Z0-9]+/g, "_").replace(/^_+|_+$/g, "").toLowerCase();
  }

  return {
    extractFields, labelFor, fill, toHtml, previewHtml, plainText,
    wordBlob, printDoc, download, slugify, escapeHtml,
  };
})();

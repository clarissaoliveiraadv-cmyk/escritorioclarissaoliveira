/* ===========================================================
   Aplicação — Gerador de Documentos (uso interno).
   Sem servidor, sem login. Tudo roda no navegador.
   =========================================================== */

(function () {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const state = { modeloId: null, clienteId: "" };

  // ---------- util ----------
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.hidden = false;
    clearTimeout(toast._t);
    toast._t = setTimeout(() => (t.hidden = true), 2200);
  }

  function dataHojeExtenso() {
    const meses = ["janeiro", "fevereiro", "março", "abril", "maio", "junho",
      "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
    const d = new Date();
    return `${String(d.getDate()).padStart(2, "0")} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
  }

  function modeloById(id) {
    return Store.getTemplates().find((t) => t.id === id) || null;
  }

  // ===========================================================
  //  NAVEGAÇÃO
  // ===========================================================
  function setTab(tab) {
    $$(".tab").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
    $$(".view").forEach((v) => v.classList.toggle("active", v.id === `view-${tab}`));
    if (tab === "modelos") renderModelos();
    if (tab === "clientes") renderClientes();
    if (tab === "historico") renderHistorico();
    if (tab === "escritorio") renderEscritorio();
  }

  // ===========================================================
  //  GERAR
  // ===========================================================
  function preencherSelectModelos() {
    const sel = $("#gerar-modelo");
    const ativos = Store.getTemplates().filter((t) => t.ativo);
    sel.innerHTML = ativos.length
      ? ativos.map((t) => `<option value="${t.id}">${Render.escapeHtml(t.nome)}</option>`).join("")
      : `<option value="">(nenhum modelo ativo)</option>`;
    if (ativos.length) {
      state.modeloId = ativos.find((t) => t.id === state.modeloId) ? state.modeloId : ativos[0].id;
      sel.value = state.modeloId;
    } else {
      state.modeloId = null;
    }
  }

  function preencherSelectClientes() {
    const sel = $("#gerar-cliente");
    const clientes = Store.getClientes();
    sel.innerHTML = `<option value="">— Sem cliente / preencher manualmente —</option>` +
      clientes.map((c) => `<option value="${c.id}">${Render.escapeHtml(c.nome_completo || "(sem nome)")}</option>`).join("");
    sel.value = state.clienteId || "";
  }

  function renderCamposGerar() {
    const wrap = $("#gerar-campos");
    const modelo = modeloById(state.modeloId);
    if (!modelo) {
      wrap.innerHTML = `<p class="empty">Nenhum modelo selecionado.</p>`;
      return;
    }
    const campos = Render.extractFields(modelo.corpo);
    if (!campos.length) {
      wrap.innerHTML = `<p class="empty">Este modelo não possui campos variáveis.</p>`;
      return;
    }

    const escritorio = Store.getEscritorio();
    const cliente = state.clienteId
      ? Store.getClientes().find((c) => c.id === state.clienteId)
      : null;

    // valor inicial de cada campo
    function valorInicial(campo) {
      if (cliente && window.CLIENTE_FIELDS.includes(campo) && cliente[campo]) return cliente[campo];
      if (window.ESCRITORIO_FIELDS.includes(campo) && escritorio[campo]) return escritorio[campo];
      if (campo === "data_documento") return escritorio.data_documento || dataHojeExtenso();
      return "";
    }

    // agrupa
    const usados = new Set(campos);
    const grupos = [];
    for (const [nomeGrupo, lista] of Object.entries(window.FIELD_GROUPS)) {
      const presentes = lista.filter((c) => usados.has(c));
      presentes.forEach((c) => usados.delete(c));
      if (presentes.length) grupos.push([nomeGrupo, presentes]);
    }
    if (usados.size) grupos.push(["Outros", Array.from(usados)]);

    wrap.innerHTML = grupos.map(([nome, lista]) => `
      <div class="grupo">
        <div class="grupo-titulo">${nome}</div>
        <div class="campos-grid">
          ${lista.map((campo) => {
            const val = Render.escapeHtml(valorInicial(campo));
            return `<label class="field">
              <span>${Render.escapeHtml(Render.labelFor(campo))}</span>
              <input class="campo-input" data-campo="${campo}" value="${val}" />
            </label>`;
          }).join("")}
        </div>
      </div>`).join("");

    $$(".campo-input", wrap).forEach((inp) => inp.addEventListener("input", atualizarPreview));
  }

  function getDados() {
    const dados = {};
    $$(".campo-input").forEach((inp) => { dados[inp.dataset.campo] = inp.value; });
    return dados;
  }

  function atualizarPreview() {
    const modelo = modeloById(state.modeloId);
    const preview = $("#preview");
    const status = $("#preview-status");
    if (!modelo) {
      preview.innerHTML = `<p class="empty">Selecione um modelo.</p>`;
      status.textContent = "";
      return;
    }
    const dados = getDados();
    preview.innerHTML = Render.previewHtml(modelo.corpo, dados);
    const vazios = Render.extractFields(modelo.corpo).filter((c) => !String(dados[c] || "").trim()).length;
    if (vazios > 0) {
      status.textContent = `${vazios} campo(s) por preencher`;
      status.className = "preview-status pendente";
    } else {
      status.textContent = "Pronto para gerar";
      status.className = "preview-status";
    }
  }

  function nomeArquivo(modelo, dados) {
    const cli = dados.nome_completo ? "_" + Render.slugify(dados.nome_completo) : "";
    return Render.slugify(modelo.nome) + cli;
  }

  function salvarHistorico(modelo, dados) {
    Store.addHistorico({
      id: Store.uid(),
      modelo_id: modelo.id,
      modelo_nome: modelo.nome,
      modelo_versao: modelo.versao,
      cliente_nome: dados.nome_completo || "",
      dados,
      corpo: modelo.corpo,
      created_at: new Date().toISOString(),
    });
  }

  function bindGerar() {
    $("#gerar-modelo").addEventListener("change", (e) => {
      state.modeloId = e.target.value;
      renderCamposGerar();
      atualizarPreview();
    });
    $("#gerar-cliente").addEventListener("change", (e) => {
      state.clienteId = e.target.value;
      renderCamposGerar();
      atualizarPreview();
    });

    $("#btn-word").addEventListener("click", () => {
      const modelo = modeloById(state.modeloId);
      if (!modelo) return;
      const dados = getDados();
      Render.download(Render.wordBlob(modelo.nome, modelo.corpo, dados), nomeArquivo(modelo, dados) + ".doc");
      salvarHistorico(modelo, dados);
      renderHistorico();
      toast("Documento Word gerado e salvo no histórico.");
    });

    $("#btn-pdf").addEventListener("click", () => {
      const modelo = modeloById(state.modeloId);
      if (!modelo) return;
      const dados = getDados();
      const ok = Render.printDoc(modelo.nome, modelo.corpo, dados);
      if (!ok) { toast("Permita pop-ups para imprimir/salvar em PDF."); return; }
      salvarHistorico(modelo, dados);
      renderHistorico();
    });

    $("#btn-copiar").addEventListener("click", async () => {
      const modelo = modeloById(state.modeloId);
      if (!modelo) return;
      const txt = Render.plainText(modelo.corpo, getDados());
      try {
        await navigator.clipboard.writeText(txt);
        toast("Texto copiado.");
      } catch {
        // fallback
        const ta = document.createElement("textarea");
        ta.value = txt; document.body.appendChild(ta); ta.select();
        document.execCommand("copy"); document.body.removeChild(ta);
        toast("Texto copiado.");
      }
    });

    $("#btn-salvar-hist").addEventListener("click", () => {
      const modelo = modeloById(state.modeloId);
      if (!modelo) return;
      salvarHistorico(modelo, getDados());
      renderHistorico();
      toast("Salvo no histórico.");
    });
  }

  // ===========================================================
  //  MODAL genérico
  // ===========================================================
  function abrirModal(html) {
    $("#modal").innerHTML = html;
    $("#modal-overlay").hidden = false;
  }
  function fecharModal() { $("#modal-overlay").hidden = true; }

  $("#modal-overlay").addEventListener("click", (e) => {
    if (e.target.id === "modal-overlay") fecharModal();
  });

  // ===========================================================
  //  MODELOS
  // ===========================================================
  function renderModelos() {
    const lista = $("#modelos-lista");
    const modelos = Store.getTemplates();
    lista.innerHTML = modelos.map((m) => {
      const nCampos = Render.extractFields(m.corpo).length;
      return `<div class="card">
        <div class="card-titulo">${Render.escapeHtml(m.nome)}</div>
        <div class="card-tags">
          <span class="tag">${Render.escapeHtml(m.categoria || "—")}</span>
          <span class="tag">${Render.escapeHtml(m.area || "—")}</span>
          ${m.ativo ? "" : `<span class="tag inativo">inativo</span>`}
        </div>
        <div class="card-meta">${nCampos} campo(s) · versão ${m.versao || 1}</div>
        <div class="card-actions">
          <button class="btn btn-sm" data-act="editar" data-id="${m.id}">Editar</button>
          <button class="btn btn-sm" data-act="duplicar" data-id="${m.id}">Duplicar</button>
          <button class="btn btn-sm" data-act="toggle" data-id="${m.id}">${m.ativo ? "Desativar" : "Ativar"}</button>
          <button class="btn btn-sm btn-danger" data-act="excluir" data-id="${m.id}">Excluir</button>
        </div>
      </div>`;
    }).join("") + `
      <div class="card" style="justify-content:center;align-items:flex-start;border-style:dashed;">
        <div class="card-meta">Restaurar os modelos-base padrão (não remove os seus).</div>
        <div class="card-actions"><button class="btn btn-sm" id="btn-restaurar">Restaurar modelos-base</button></div>
      </div>`;

    $$('[data-act]', lista).forEach((btn) => {
      btn.addEventListener("click", () => acaoModelo(btn.dataset.act, btn.dataset.id));
    });
    $("#btn-restaurar").addEventListener("click", () => {
      Store.restoreSeeds();
      renderModelos();
      preencherSelectModelos();
      toast("Modelos-base restaurados.");
    });
  }

  function acaoModelo(act, id) {
    const modelo = modeloById(id);
    if (!modelo) return;
    if (act === "editar") return abrirModalModelo(modelo);
    if (act === "duplicar") {
      const novo = { ...modelo, id: Store.uid(), nome: modelo.nome + " (cópia)", versao: 1 };
      Store.upsertTemplate(novo);
      renderModelos(); preencherSelectModelos();
      toast("Modelo duplicado.");
    }
    if (act === "toggle") {
      modelo.ativo = !modelo.ativo;
      Store.upsertTemplate(modelo);
      renderModelos(); preencherSelectModelos();
    }
    if (act === "excluir") {
      if (confirm(`Excluir o modelo "${modelo.nome}"?`)) {
        Store.deleteTemplate(id);
        renderModelos(); preencherSelectModelos();
        toast("Modelo excluído.");
      }
    }
  }

  function abrirModalModelo(modelo) {
    const novo = !modelo;
    const m = modelo || { id: Store.uid(), nome: "", categoria: "", area: "", corpo: "", ativo: true, versao: 1 };
    abrirModal(`
      <h2>${novo ? "Novo modelo" : "Editar modelo"}</h2>
      <div class="campos-grid">
        <label class="field"><span>Nome do modelo</span><input id="m-nome" value="${Render.escapeHtml(m.nome)}" /></label>
        <label class="field"><span>Categoria</span><input id="m-categoria" value="${Render.escapeHtml(m.categoria)}" placeholder="Procurações, Contratação, Processual..." /></label>
        <label class="field"><span>Área</span><input id="m-area" value="${Render.escapeHtml(m.area)}" placeholder="Trabalhista, Previdenciário..." /></label>
        <label class="field"><span>Ativo</span>
          <select id="m-ativo"><option value="1"${m.ativo ? " selected" : ""}>Sim</option><option value="0"${!m.ativo ? " selected" : ""}>Não</option></select>
        </label>
      </div>
      <label class="field">
        <span>Texto do modelo — use {{campo}} para os dados variáveis. Linhas: <b># Título</b>, <b>## Subtítulo</b>, <b>~ assinatura</b>.</span>
        <textarea id="m-corpo">${Render.escapeHtml(m.corpo)}</textarea>
      </label>
      <div class="card-meta" id="m-campos-detectados"></div>
      <div class="modal-foot">
        <button class="btn btn-ghost" id="m-cancelar">Cancelar</button>
        <button class="btn btn-primary" id="m-salvar">Salvar modelo</button>
      </div>`);

    const detectar = () => {
      const campos = Render.extractFields($("#m-corpo").value);
      $("#m-campos-detectados").innerHTML = campos.length
        ? "Campos detectados: " + campos.map((c) => `<span class="tag">${Render.escapeHtml(Render.labelFor(c))}</span>`).join(" ")
        : "Nenhum campo {{...}} detectado ainda.";
    };
    $("#m-corpo").addEventListener("input", detectar);
    detectar();

    $("#m-cancelar").addEventListener("click", fecharModal);
    $("#m-salvar").addEventListener("click", () => {
      const nome = $("#m-nome").value.trim();
      if (!nome) { toast("Informe o nome do modelo."); return; }
      const atualizado = {
        ...m,
        nome,
        categoria: $("#m-categoria").value.trim(),
        area: $("#m-area").value.trim(),
        ativo: $("#m-ativo").value === "1",
        corpo: $("#m-corpo").value,
        versao: novo ? 1 : (m.versao || 1) + 1,
      };
      Store.upsertTemplate(atualizado);
      fecharModal();
      renderModelos();
      preencherSelectModelos();
      if (state.modeloId === atualizado.id) { renderCamposGerar(); atualizarPreview(); }
      toast("Modelo salvo.");
    });
  }

  // ===========================================================
  //  CLIENTES
  // ===========================================================
  function renderClientes() {
    const lista = $("#clientes-lista");
    const clientes = Store.getClientes();
    if (!clientes.length) {
      lista.innerHTML = `<p class="empty">Nenhum cliente cadastrado ainda.</p>`;
      return;
    }
    lista.innerHTML = clientes.map((c) => `
      <div class="card">
        <div class="card-titulo">${Render.escapeHtml(c.nome_completo || "(sem nome)")}</div>
        <div class="card-meta">
          ${c.cpf ? "CPF: " + Render.escapeHtml(c.cpf) : (c.cnpj ? "CNPJ: " + Render.escapeHtml(c.cnpj) : "")}
          ${c.telefone ? " · " + Render.escapeHtml(c.telefone) : ""}
        </div>
        <div class="card-meta">${Render.escapeHtml([c.cidade, c.estado].filter(Boolean).join("/"))}</div>
        <div class="card-actions">
          <button class="btn btn-sm" data-act="editar" data-id="${c.id}">Editar</button>
          <button class="btn btn-sm btn-danger" data-act="excluir" data-id="${c.id}">Excluir</button>
        </div>
      </div>`).join("");

    $$('[data-act]', lista).forEach((btn) => btn.addEventListener("click", () => {
      const c = clientes.find((x) => x.id === btn.dataset.id);
      if (btn.dataset.act === "editar") abrirModalCliente(c);
      if (btn.dataset.act === "excluir" && confirm("Excluir este cliente?")) {
        Store.deleteCliente(c.id);
        renderClientes(); preencherSelectClientes();
        toast("Cliente excluído.");
      }
    }));
  }

  function abrirModalCliente(cliente) {
    const novo = !cliente;
    const c = cliente || { id: Store.uid() };
    const inputs = window.CLIENTE_FIELDS.map((campo) => {
      const val = Render.escapeHtml(c[campo] || "");
      return `<label class="field"><span>${Render.escapeHtml(Render.labelFor(campo))}</span>
        <input data-campo="${campo}" value="${val}" /></label>`;
    }).join("");
    abrirModal(`
      <h2>${novo ? "Novo cliente" : "Editar cliente"}</h2>
      <div class="campos-grid">${inputs}</div>
      <div class="modal-foot">
        <button class="btn btn-ghost" id="c-cancelar">Cancelar</button>
        <button class="btn btn-primary" id="c-salvar">Salvar cliente</button>
      </div>`);
    $("#c-cancelar").addEventListener("click", fecharModal);
    $("#c-salvar").addEventListener("click", () => {
      const atualizado = { ...c };
      $$("[data-campo]", $("#modal")).forEach((inp) => { atualizado[inp.dataset.campo] = inp.value.trim(); });
      if (!atualizado.nome_completo) { toast("Informe o nome do cliente."); return; }
      Store.upsertCliente(atualizado);
      fecharModal();
      renderClientes();
      preencherSelectClientes();
      toast("Cliente salvo.");
    });
  }

  // ===========================================================
  //  HISTÓRICO
  // ===========================================================
  function renderHistorico() {
    const lista = $("#historico-lista");
    const hist = Store.getHistorico();
    $("#hist-count").textContent = hist.length ? `${hist.length} documento(s)` : "";
    if (!hist.length) {
      lista.innerHTML = `<p class="empty">Nenhum documento gerado ainda.</p>`;
      return;
    }
    lista.innerHTML = hist.map((h) => {
      const data = new Date(h.created_at).toLocaleString("pt-BR");
      return `<div class="card">
        <div class="card-titulo">${Render.escapeHtml(h.modelo_nome)}</div>
        <div class="card-meta">${h.cliente_nome ? Render.escapeHtml(h.cliente_nome) + " · " : ""}${data}</div>
        <div class="card-actions">
          <button class="btn btn-sm" data-act="word" data-id="${h.id}">Word</button>
          <button class="btn btn-sm" data-act="pdf" data-id="${h.id}">PDF</button>
          <button class="btn btn-sm" data-act="copiar" data-id="${h.id}">Copiar</button>
          <button class="btn btn-sm btn-danger" data-act="excluir" data-id="${h.id}">Excluir</button>
        </div>
      </div>`;
    }).join("");

    $$('[data-act]', lista).forEach((btn) => btn.addEventListener("click", async () => {
      const h = hist.find((x) => x.id === btn.dataset.id);
      if (!h) return;
      const fname = Render.slugify(h.modelo_nome) + (h.cliente_nome ? "_" + Render.slugify(h.cliente_nome) : "");
      if (btn.dataset.act === "word") {
        Render.download(Render.wordBlob(h.modelo_nome, h.corpo, h.dados), fname + ".doc");
      } else if (btn.dataset.act === "pdf") {
        if (!Render.printDoc(h.modelo_nome, h.corpo, h.dados)) toast("Permita pop-ups para o PDF.");
      } else if (btn.dataset.act === "copiar") {
        try { await navigator.clipboard.writeText(Render.plainText(h.corpo, h.dados)); toast("Texto copiado."); }
        catch { toast("Não foi possível copiar."); }
      } else if (btn.dataset.act === "excluir") {
        if (confirm("Excluir do histórico?")) { Store.deleteHistorico(h.id); renderHistorico(); }
      }
    }));
  }

  // ===========================================================
  //  ESCRITÓRIO
  // ===========================================================
  function renderEscritorio() {
    const form = $("#escritorio-form");
    const dados = Store.getEscritorio();
    const inputs = window.ESCRITORIO_FIELDS.map((campo) => {
      const val = Render.escapeHtml(dados[campo] || "");
      return `<label class="field"><span>${Render.escapeHtml(Render.labelFor(campo))}</span>
        <input data-campo="${campo}" value="${val}" /></label>`;
    }).join("");
    form.innerHTML = `<div class="campos-grid">${inputs}</div>
      <div class="actions"><button class="btn btn-primary" id="esc-salvar">Salvar dados do escritório</button></div>`;
    $("#esc-salvar").addEventListener("click", () => {
      const novo = {};
      $$("[data-campo]", form).forEach((inp) => { novo[inp.dataset.campo] = inp.value.trim(); });
      Store.saveEscritorio(novo);
      toast("Dados do escritório salvos.");
      if (state.modeloId) { renderCamposGerar(); atualizarPreview(); }
    });
  }

  // ===========================================================
  //  INIT
  // ===========================================================
  function init() {
    $$(".tab").forEach((b) => b.addEventListener("click", () => setTab(b.dataset.tab)));
    $("#btn-novo-modelo").addEventListener("click", () => abrirModalModelo(null));
    $("#btn-novo-cliente").addEventListener("click", () => abrirModalCliente(null));
    bindGerar();

    Store.getTemplates(); // garante seeds na 1ª execução
    preencherSelectModelos();
    preencherSelectClientes();
    renderCamposGerar();
    atualizarPreview();
  }

  document.addEventListener("DOMContentLoaded", init);
})();

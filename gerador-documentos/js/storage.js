/* ===========================================================
   Persistência local (localStorage). Sem servidor: tudo fica
   salvo no navegador deste computador.
   =========================================================== */

window.Store = (function () {
  const KEYS = {
    templates: "gd_templates",
    clientes: "gd_clientes",
    historico: "gd_historico",
    escritorio: "gd_escritorio",
  };

  function read(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  }

  function write(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function uid() {
    return "id_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  // ---- Templates ----
  function getTemplates() {
    let t = read(KEYS.templates, null);
    if (!t) {
      // primeira execução: carrega os modelos-base
      t = JSON.parse(JSON.stringify(window.SEED_TEMPLATES));
      write(KEYS.templates, t);
    }
    return t;
  }
  function saveTemplates(list) { write(KEYS.templates, list); }
  function upsertTemplate(tpl) {
    const list = getTemplates();
    const i = list.findIndex((x) => x.id === tpl.id);
    if (i >= 0) list[i] = tpl;
    else list.push(tpl);
    saveTemplates(list);
  }
  function deleteTemplate(id) {
    saveTemplates(getTemplates().filter((x) => x.id !== id));
  }
  function restoreSeeds() {
    write(KEYS.templates, JSON.parse(JSON.stringify(window.SEED_TEMPLATES)));
  }

  // ---- Clientes ----
  function getClientes() { return read(KEYS.clientes, []); }
  function saveClientes(list) { write(KEYS.clientes, list); }
  function upsertCliente(c) {
    const list = getClientes();
    const i = list.findIndex((x) => x.id === c.id);
    if (i >= 0) list[i] = c;
    else list.push(c);
    saveClientes(list);
  }
  function deleteCliente(id) {
    saveClientes(getClientes().filter((x) => x.id !== id));
  }

  // ---- Histórico ----
  function getHistorico() { return read(KEYS.historico, []); }
  function addHistorico(item) {
    const list = getHistorico();
    list.unshift(item);
    write(KEYS.historico, list);
  }
  function deleteHistorico(id) {
    write(KEYS.historico, getHistorico().filter((x) => x.id !== id));
  }

  // ---- Escritório ----
  function getEscritorio() {
    let e = read(KEYS.escritorio, null);
    if (!e) {
      e = Object.assign({}, window.ESCRITORIO_DEFAULT || {});
      write(KEYS.escritorio, e);
    }
    return e;
  }
  function saveEscritorio(obj) { write(KEYS.escritorio, obj); }

  return {
    uid,
    getTemplates, saveTemplates, upsertTemplate, deleteTemplate, restoreSeeds,
    getClientes, upsertCliente, deleteCliente,
    getHistorico, addHistorico, deleteHistorico,
    getEscritorio, saveEscritorio,
  };
})();

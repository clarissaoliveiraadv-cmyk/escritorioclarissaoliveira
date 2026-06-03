/* ===========================================================
   Dicionário de campos variáveis.
   - LABELS: rótulo amigável para cada {{campo}}.
   - GRUPOS: organiza os campos no formulário de geração.
   - CLIENTE_FIELDS: campos preenchidos a partir do cadastro de cliente.
   Campos não listados aqui aparecem no grupo "Outros" com rótulo
   gerado automaticamente.
   =========================================================== */

window.FIELD_LABELS = {
  // Cliente
  nome_completo: "Nome completo",
  nacionalidade: "Nacionalidade",
  estado_civil: "Estado civil",
  profissao: "Profissão",
  cpf: "CPF",
  cnpj: "CNPJ",
  rg: "RG",
  orgao_emissor: "Órgão emissor (RG)",
  pis_nit: "PIS / NIT",
  data_nascimento: "Data de nascimento",
  endereco: "Endereço (logradouro)",
  numero: "Número",
  complemento: "Complemento",
  bairro: "Bairro",
  cidade: "Cidade",
  estado: "Estado (UF)",
  cep: "CEP",
  telefone: "Telefone",
  email: "E-mail",
  representante_legal: "Representante legal",

  // Processo
  numero_processo: "Número do processo",
  vara: "Vara",
  comarca: "Comarca",
  tribunal: "Tribunal",
  parte_contraria: "Parte contrária",
  tipo_acao: "Tipo de ação",
  fase_processual: "Fase processual",
  data_audiencia: "Data da audiência",
  hora_audiencia: "Hora da audiência",

  // Financeiro
  valor_total: "Valor total",
  valor_entrada: "Valor de entrada",
  percentual_honorarios: "Percentual de honorários (%)",
  percentual_fgts: "Percentual sobre FGTS (%)",
  forma_pagamento: "Forma de pagamento",
  quantidade_parcelas: "Quantidade de parcelas",
  valor_parcela: "Valor da parcela",
  data_vencimento: "Data de vencimento",
  chave_pix: "Chave PIX",
  objeto_consultoria: "Objeto da consultoria",

  // Escritório
  nome_advogada: "Nome da advogada",
  oab: "OAB",
  sociedade: "Sociedade / escritório",
  cnpj_escritorio: "CNPJ do escritório",
  endereco_escritorio: "Endereço do escritório",
  telefone_escritorio: "Telefone do escritório",
  email_escritorio: "E-mail do escritório",
  cidade_assinatura: "Cidade da assinatura",
  data_documento: "Data do documento",
};

window.FIELD_GROUPS = {
  Cliente: [
    "nome_completo", "nacionalidade", "estado_civil", "profissao",
    "cpf", "cnpj", "rg", "orgao_emissor", "pis_nit", "data_nascimento",
    "endereco", "numero", "complemento", "bairro", "cidade", "estado",
    "cep", "telefone", "email", "representante_legal",
  ],
  Processo: [
    "numero_processo", "vara", "comarca", "tribunal", "parte_contraria",
    "tipo_acao", "fase_processual", "data_audiencia", "hora_audiencia",
  ],
  Financeiro: [
    "valor_total", "valor_entrada", "percentual_honorarios", "percentual_fgts",
    "forma_pagamento", "quantidade_parcelas", "valor_parcela", "data_vencimento",
    "chave_pix", "objeto_consultoria",
  ],
  Escritório: [
    "nome_advogada", "oab", "sociedade", "cnpj_escritorio", "endereco_escritorio",
    "telefone_escritorio", "email_escritorio", "cidade_assinatura", "data_documento",
  ],
};

// Campos vindos do cadastro de cliente (auto-preenchidos ao escolher um cliente).
window.CLIENTE_FIELDS = window.FIELD_GROUPS.Cliente.slice();

// Campos vindos do cadastro do escritório (auto-preenchidos sempre).
window.ESCRITORIO_FIELDS = window.FIELD_GROUPS.Escritório.slice();

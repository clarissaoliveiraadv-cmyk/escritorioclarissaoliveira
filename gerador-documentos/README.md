# Gerador de Documentos — Clarissa Oliveira Advocacia

Aplicativo **interno** para gerar documentos jurídicos (procurações, declarações,
contratos de honorários, peças simples) a partir de modelos com campos variáveis.

- ✅ Roda **100% no navegador**, sem login e sem servidor.
- ✅ Funciona **offline** (basta abrir o arquivo).
- ✅ Os dados (clientes, modelos, histórico) ficam **salvos neste computador/navegador**.
- ✅ Gera **Word (.doc)**, **PDF** (impressão) e **texto** para WhatsApp.
- ✅ Já vem com o **timbre (logo Clarissa Oliveira)** no topo e o **rodapé do
  escritório**, além dos **documentos reais** (Procuração, Declaração de
  Insuficiência, Contratos de Honorários trabalhista e previdenciário).

---

## Como abrir

1. Abra a pasta `gerador-documentos`.
2. Dê **duplo clique** em `index.html` (abre no navegador).
   - Dica: deixe um atalho de `index.html` na área de trabalho.

> Para vários computadores acessarem ao mesmo tempo, depois dá para hospedar
> esta pasta em um servidor estático (ex.: GitHub Pages). Mas para começar,
> abrir o arquivo já funciona.

---

## Primeiro uso (recomendado)

1. Aba **Escritório** → preencha os dados da advogada/escritório (nome, OAB,
   endereço, PIX, cidade). Eles entram **automaticamente** em todos os documentos.
2. Aba **Clientes** → cadastre seus clientes (nome, CPF, endereço...). Ao gerar,
   basta escolher o cliente que os campos se preenchem sozinhos.
3. Aba **Modelos** → revise os modelos-base e ajuste o texto para a redação do
   seu escritório (veja abaixo).

---

## Gerar um documento

Aba **Gerar**:

1. Escolha o **modelo**.
2. (Opcional) Escolha o **cliente** — preenche os dados automaticamente.
3. Complete os campos que faltarem (processo, valores, etc.).
4. Acompanhe a **pré-visualização** à direita (campos em amarelo = por preencher).
5. Clique em **Baixar Word**, **Imprimir / Salvar PDF** ou **Copiar texto**.

Todo documento gerado fica salvo na aba **Histórico**, de onde pode ser baixado
de novo.

---

## Editar / criar modelos

Aba **Modelos** → **Editar** (ou **+ Novo modelo**).

No texto do modelo, use:

| Sintaxe        | Resultado                                  |
|----------------|--------------------------------------------|
| `{{cpf}}`      | campo variável (preenchido na geração)     |
| `# Título`     | título centralizado em maiúsculas          |
| `## Subtítulo` | subtítulo / cláusula                        |
| `~ texto`      | linha centralizada (assinatura, data)      |
| linha em branco| separa parágrafos                          |

**Para usar seus modelos reais do Word:** abra o documento no Word, copie o texto,
cole no campo "Texto do modelo" e troque os dados que mudam por `{{campo}}`
(ex.: o nome do cliente vira `{{nome_completo}}`). Os campos detectados aparecem
listados abaixo do texto.

Nomes de campos já reconhecidos (com rótulo amigável) estão em
`data/fields.js`. Você pode inventar novos campos livremente — eles aparecem no
grupo "Outros".

---

## Backup

Como os dados ficam no navegador, para **fazer backup** ou levar para outro
computador, use a exportação do navegador ou, futuramente, podemos adicionar um
botão "Exportar/Importar dados (.json)". Hoje, os modelos-base sempre podem ser
restaurados pelo botão **Restaurar modelos-base** na aba Modelos.

---

## Estrutura técnica (para quem for dar manutenção)

```
gerador-documentos/
├── index.html         estrutura e navegação
├── styles.css         estilos
├── data/
│   ├── fields.js      dicionário de campos (rótulos e grupos)
│   └── templates.js   modelos-base padrão
└── js/
    ├── storage.js     persistência (localStorage)
    ├── render.js      substituição de campos + exportação Word/PDF
    └── app.js         lógica da interface
```

Sem dependências, sem build, sem internet. Scripts clássicos para funcionar
direto pelo `file://` (duplo clique).

/* ===========================================================
   Modelos-base (padrão). Carregados na primeira execução.
   Você pode editar, duplicar, desativar ou substituir o texto
   de cada modelo dentro do app (aba "Modelos").

   Sintaxe do corpo:
     {{campo}}        -> campo variável (preenchido na geração)
     # Título         -> título centralizado em maiúsculas
     ## Subtítulo     -> subtítulo
     ~ linha          -> linha de assinatura (centralizada)
     linha em branco  -> separa parágrafos
   =========================================================== */

window.SEED_TEMPLATES = [
  {
    id: "proc-ad-judicia",
    nome: "Procuração ad judicia et extra",
    categoria: "Procurações",
    area: "Geral",
    ativo: true,
    versao: 1,
    corpo: `# Procuração

OUTORGANTE: {{nome_completo}}, {{nacionalidade}}, {{estado_civil}}, {{profissao}}, portador(a) do RG nº {{rg}} - {{orgao_emissor}}, inscrito(a) no CPF sob o nº {{cpf}}, residente e domiciliado(a) em {{endereco}}, nº {{numero}}, {{complemento}}, bairro {{bairro}}, {{cidade}}/{{estado}}, CEP {{cep}}.

OUTORGADA: {{nome_advogada}}, advogada inscrita na OAB sob o nº {{oab}}, integrante de {{sociedade}}, com escritório profissional em {{endereco_escritorio}}, onde recebe intimações e notificações.

PODERES: Pelo presente instrumento particular de mandato, o(a) outorgante nomeia e constitui sua bastante procuradora a outorgada acima qualificada, a quem confere os poderes da cláusula "ad judicia et extra", para o foro em geral, em qualquer Juízo, Instância ou Tribunal, podendo propor as ações cabíveis e defendê-lo(a) nas contrárias, seguindo umas e outras até final decisão, usando os recursos legais e acompanhando-os, conferindo-lhe, ainda, poderes especiais para confessar, desistir, transigir, firmar compromissos ou acordos, receber e dar quitação, agindo em conjunto ou separadamente, podendo ainda substabelecer esta a outrem, com ou sem reserva de iguais poderes, para o cumprimento do presente mandato.

~ {{cidade_assinatura}}, {{data_documento}}.

~ _______________________________________________
{{nome_completo}}`,
  },

  {
    id: "proc-previdenciaria",
    nome: "Procuração previdenciária (INSS)",
    categoria: "Procurações",
    area: "Previdenciário",
    ativo: true,
    versao: 1,
    corpo: `# Procuração

OUTORGANTE: {{nome_completo}}, {{nacionalidade}}, {{estado_civil}}, {{profissao}}, portador(a) do RG nº {{rg}}, inscrito(a) no CPF sob o nº {{cpf}}, PIS/NIT nº {{pis_nit}}, residente e domiciliado(a) em {{endereco}}, nº {{numero}}, bairro {{bairro}}, {{cidade}}/{{estado}}, CEP {{cep}}.

OUTORGADA: {{nome_advogada}}, advogada inscrita na OAB sob o nº {{oab}}, integrante de {{sociedade}}, com escritório em {{endereco_escritorio}}.

PODERES: O(a) outorgante confere à outorgada os poderes da cláusula "ad judicia et extra" para o foro em geral e, em especial, para representá-lo(a) perante o Instituto Nacional do Seguro Social - INSS e a Justiça Federal, podendo requerer e acompanhar benefícios previdenciários e assistenciais, formular requerimentos administrativos, ter acesso a processos e prontuários médicos, interpor recursos, agendar e acompanhar perícias, receber valores e dar quitação, bem como substabelecer, com ou sem reserva de poderes.

~ {{cidade_assinatura}}, {{data_documento}}.

~ _______________________________________________
{{nome_completo}}`,
  },

  {
    id: "proc-pessoa-juridica",
    nome: "Procuração pessoa jurídica",
    categoria: "Procurações",
    area: "Empresarial",
    ativo: true,
    versao: 1,
    corpo: `# Procuração

OUTORGANTE: {{nome_completo}}, pessoa jurídica de direito privado, inscrita no CNPJ sob o nº {{cnpj}}, com sede em {{endereco}}, nº {{numero}}, bairro {{bairro}}, {{cidade}}/{{estado}}, CEP {{cep}}, neste ato representada por {{representante_legal}}.

OUTORGADA: {{nome_advogada}}, advogada inscrita na OAB sob o nº {{oab}}, integrante de {{sociedade}}, com escritório em {{endereco_escritorio}}.

PODERES: A outorgante confere à outorgada os poderes da cláusula "ad judicia et extra", para o foro em geral, em qualquer Juízo, Instância ou Tribunal, podendo propor e contestar ações, recorrer, transigir, firmar acordos, receber e dar quitação, representá-la perante órgãos públicos e privados, bem como substabelecer, com ou sem reserva de poderes, para o fiel cumprimento do presente mandato.

~ {{cidade_assinatura}}, {{data_documento}}.

~ _______________________________________________
{{representante_legal}}
{{nome_completo}}`,
  },

  {
    id: "declaracao-hipossuficiencia",
    nome: "Declaração de hipossuficiência",
    categoria: "Declarações",
    area: "Geral",
    ativo: true,
    versao: 1,
    corpo: `# Declaração de Hipossuficiência

Eu, {{nome_completo}}, {{nacionalidade}}, {{estado_civil}}, {{profissao}}, inscrito(a) no CPF sob o nº {{cpf}}, portador(a) do RG nº {{rg}}, residente e domiciliado(a) em {{endereco}}, nº {{numero}}, bairro {{bairro}}, {{cidade}}/{{estado}}, DECLARO, para os devidos fins de direito e sob as penas da lei, que não possuo condições de arcar com as custas e despesas processuais e com os honorários advocatícios sem prejuízo do meu próprio sustento e do de minha família.

Em razão disso, com fundamento no art. 98 do Código de Processo Civil e na Lei nº 1.060/50, requeiro a concessão dos benefícios da gratuidade da justiça.

Por ser expressão da verdade, firmo a presente declaração.

~ {{cidade_assinatura}}, {{data_documento}}.

~ _______________________________________________
{{nome_completo}}
CPF: {{cpf}}`,
  },

  {
    id: "contrato-honorarios-trabalhista",
    nome: "Contrato de honorários — trabalhista",
    categoria: "Contratação",
    area: "Trabalhista",
    ativo: true,
    versao: 1,
    corpo: `# Contrato de Prestação de Serviços Advocatícios

CONTRATANTE: {{nome_completo}}, {{nacionalidade}}, {{estado_civil}}, {{profissao}}, inscrito(a) no CPF sob o nº {{cpf}}, RG nº {{rg}}, residente em {{endereco}}, nº {{numero}}, {{bairro}}, {{cidade}}/{{estado}}.

CONTRATADA: {{nome_advogada}}, advogada inscrita na OAB sob o nº {{oab}}, integrante de {{sociedade}}, com escritório em {{endereco_escritorio}}.

## Cláusula 1ª — Do objeto
A CONTRATADA prestará serviços advocatícios ao(à) CONTRATANTE na propositura e acompanhamento de ação {{tipo_acao}} em face de {{parte_contraria}}, até a decisão final e respectiva execução.

## Cláusula 2ª — Dos honorários
Pelos serviços, o(a) CONTRATANTE pagará à CONTRATADA: (a) honorários iniciais no valor de R$ {{valor_entrada}}; e (b) honorários de êxito correspondentes a {{percentual_honorarios}}% sobre o proveito econômico obtido, acrescidos de {{percentual_fgts}}% incidentes sobre eventuais valores de FGTS. Os honorários de sucumbência pertencem exclusivamente à CONTRATADA.

## Cláusula 3ª — Do pagamento
O pagamento será realizado por {{forma_pagamento}}, em {{quantidade_parcelas}} parcela(s) de R$ {{valor_parcela}}, com vencimento a partir de {{data_vencimento}}. Chave PIX para pagamento: {{chave_pix}}.

## Cláusula 4ª — Das despesas
Custas, taxas, emolumentos e demais despesas processuais correrão por conta do(a) CONTRATANTE.

## Cláusula 5ª — Do foro
Fica eleito o foro da comarca de {{cidade}} para dirimir dúvidas oriundas deste contrato.

E, por estarem de acordo, firmam o presente em duas vias.

~ {{cidade_assinatura}}, {{data_documento}}.

~ _______________________________________________
{{nome_completo}} — Contratante

~ _______________________________________________
{{nome_advogada}} — OAB {{oab}}`,
  },

  {
    id: "contrato-honorarios-previdenciario",
    nome: "Contrato de honorários — previdenciário",
    categoria: "Contratação",
    area: "Previdenciário",
    ativo: true,
    versao: 1,
    corpo: `# Contrato de Prestação de Serviços Advocatícios

CONTRATANTE: {{nome_completo}}, {{nacionalidade}}, {{estado_civil}}, {{profissao}}, CPF nº {{cpf}}, RG nº {{rg}}, PIS/NIT nº {{pis_nit}}, residente em {{endereco}}, nº {{numero}}, {{bairro}}, {{cidade}}/{{estado}}.

CONTRATADA: {{nome_advogada}}, advogada inscrita na OAB sob o nº {{oab}}, integrante de {{sociedade}}, com escritório em {{endereco_escritorio}}.

## Cláusula 1ª — Do objeto
A CONTRATADA prestará serviços advocatícios visando à concessão/revisão de benefício previdenciário ({{tipo_acao}}) perante o INSS e/ou o Poder Judiciário, na via administrativa e/ou judicial, até decisão final.

## Cláusula 2ª — Dos honorários
A título de honorários, o(a) CONTRATANTE pagará: (a) o valor inicial de R$ {{valor_entrada}}; e (b) {{percentual_honorarios}}% sobre o proveito econômico obtido, incluídas as parcelas atrasadas pagas administrativa ou judicialmente. Os honorários de sucumbência pertencem exclusivamente à CONTRATADA.

## Cláusula 3ª — Do pagamento
Pagamento por {{forma_pagamento}}, em {{quantidade_parcelas}} parcela(s) de R$ {{valor_parcela}}, vencendo a partir de {{data_vencimento}}. Chave PIX: {{chave_pix}}.

## Cláusula 4ª — Do foro
Fica eleito o foro da comarca de {{cidade}} para dirimir questões deste contrato.

E, por estarem justos e contratados, firmam o presente em duas vias.

~ {{cidade_assinatura}}, {{data_documento}}.

~ _______________________________________________
{{nome_completo}} — Contratante

~ _______________________________________________
{{nome_advogada}} — OAB {{oab}}`,
  },

  {
    id: "contrato-consultoria",
    nome: "Contrato de consultoria jurídica",
    categoria: "Contratação",
    area: "Empresarial",
    ativo: true,
    versao: 1,
    corpo: `# Contrato de Consultoria Jurídica

CONTRATANTE: {{nome_completo}}, inscrito(a) no CNPJ/CPF sob o nº {{cnpj}}, com sede/endereço em {{endereco}}, nº {{numero}}, {{bairro}}, {{cidade}}/{{estado}}, representado(a) por {{representante_legal}}.

CONTRATADA: {{nome_advogada}}, advogada inscrita na OAB sob o nº {{oab}}, integrante de {{sociedade}}.

## Cláusula 1ª — Do objeto
A CONTRATADA prestará consultoria jurídica relativa a {{objeto_consultoria}}, compreendendo análise, pareceres e orientação técnica sobre a matéria.

## Cláusula 2ª — Dos honorários
Pela consultoria, o(a) CONTRATANTE pagará o valor total de R$ {{valor_total}}, por {{forma_pagamento}}, em {{quantidade_parcelas}} parcela(s) de R$ {{valor_parcela}}, a partir de {{data_vencimento}}. Chave PIX: {{chave_pix}}.

## Cláusula 3ª — Da vigência
O presente contrato vigora a partir de {{data_documento}}, podendo ser renovado por acordo entre as partes.

## Cláusula 4ª — Do foro
Fica eleito o foro da comarca de {{cidade}}.

~ {{cidade_assinatura}}, {{data_documento}}.

~ _______________________________________________
{{representante_legal}} — Contratante

~ _______________________________________________
{{nome_advogada}} — OAB {{oab}}`,
  },

  {
    id: "proposta-defesa-trabalhista",
    nome: "Proposta de defesa trabalhista (empresa)",
    categoria: "Contratação",
    area: "Trabalhista",
    ativo: true,
    versao: 1,
    corpo: `# Proposta de Honorários — Defesa Trabalhista

À {{nome_completo}}
CNPJ: {{cnpj}}
A/C: {{representante_legal}}

Prezados(as) Senhores(as),

Apresentamos proposta para atuação na defesa da empresa na reclamação trabalhista movida por {{parte_contraria}}, processo nº {{numero_processo}}, em trâmite perante a {{vara}} de {{comarca}}.

## Escopo
Análise do caso, elaboração de defesa, acompanhamento de audiências, produção de provas, recursos cabíveis e acompanhamento até decisão final.

## Honorários
Honorários no valor total de R$ {{valor_total}}, pagos por {{forma_pagamento}}, em {{quantidade_parcelas}} parcela(s) de R$ {{valor_parcela}}, a partir de {{data_vencimento}}. Os honorários de sucumbência, quando arbitrados em favor da empresa, pertencem à CONTRATADA.

## Validade
Esta proposta é válida por 15 (quinze) dias a contar de {{data_documento}}.

Colocamo-nos à disposição para esclarecimentos.

~ {{cidade_assinatura}}, {{data_documento}}.

~ _______________________________________________
{{nome_advogada}} — OAB {{oab}}
{{sociedade}}`,
  },

  {
    id: "pedido-habilitacao",
    nome: "Pedido de habilitação nos autos",
    categoria: "Processual",
    area: "Geral",
    ativo: true,
    versao: 1,
    corpo: `# Excelentíssimo(a) Senhor(a) Doutor(a) Juiz(a) de Direito

Processo nº {{numero_processo}}
{{vara}} — Comarca de {{comarca}}

{{nome_advogada}}, advogada inscrita na OAB sob o nº {{oab}}, integrante de {{sociedade}}, com escritório em {{endereco_escritorio}}, onde recebe intimações, vem, respeitosamente, à presença de Vossa Excelência, na qualidade de patrona de {{nome_completo}}, conforme procuração anexa, requerer sua HABILITAÇÃO nos autos em epígrafe.

Requer, ainda, que todas as futuras intimações e publicações sejam realizadas exclusivamente em nome da subscritora, sob pena de nulidade.

Termos em que, pede deferimento.

~ {{cidade_assinatura}}, {{data_documento}}.

~ _______________________________________________
{{nome_advogada}} — OAB {{oab}}`,
  },

  {
    id: "peticao-juntada",
    nome: "Petição simples de juntada",
    categoria: "Processual",
    area: "Geral",
    ativo: true,
    versao: 1,
    corpo: `# Excelentíssimo(a) Senhor(a) Doutor(a) Juiz(a) de Direito

Processo nº {{numero_processo}}
{{vara}} — Comarca de {{comarca}}

{{nome_completo}}, já qualificado(a) nos autos do processo em epígrafe, por sua advogada que esta subscreve, vem, respeitosamente, à presença de Vossa Excelência requerer a JUNTADA dos documentos anexos, por serem pertinentes e necessários ao deslinde da causa.

Requer que os documentos sejam considerados para todos os fins de direito.

Termos em que, pede deferimento.

~ {{cidade_assinatura}}, {{data_documento}}.

~ _______________________________________________
{{nome_advogada}} — OAB {{oab}}`,
  },
];

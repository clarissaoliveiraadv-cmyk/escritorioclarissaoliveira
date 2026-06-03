/* ===========================================================
   Modelos do escritório Clarissa Oliveira Advocacia.
   Os 4 primeiros são os documentos reais enviados, já com os
   campos variáveis {{...}}. Você pode editar tudo na aba "Modelos".

   Sintaxe do corpo:
     {{campo}}        -> campo variável (preenchido na geração)
     # Título         -> título centralizado / sublinhado
     ## Subtítulo     -> subtítulo (cláusula) centralizado
     ~ linha          -> linha centralizada (data, assinaturas)
     linha em branco  -> separa parágrafos

   Observação: os dados do escritório (logo, endereço, telefone,
   e-mail) saem automaticamente no timbre/rodapé — veja a aba
   "Escritório".
   =========================================================== */

// Dados do escritório usados na primeira execução (timbre/rodapé).
window.ESCRITORIO_DEFAULT = {
  nome_advogada: "Clarissa de Oliveira",
  oab: "133.596",
  sociedade: "Clarissa Oliveira Sociedade Individual de Advocacia",
  cnpj_escritorio: "52.831.026/0001-85",
  endereco_escritorio: "Rua Paracatu, nº 277, sala 46 — Bairro Barro Preto, Belo Horizonte/MG, CEP 30.180.090",
  telefone_escritorio: "(31) 99705-2805",
  email_escritorio: "clarissaoliveira.adv@gmail.com",
  cidade_assinatura: "Belo Horizonte, MG",
  data_documento: "",
};

window.SEED_TEMPLATES = [
  {
    id: "procuracao",
    nome: "Procuração (ad judicia et extra)",
    categoria: "Procurações",
    area: "Geral",
    ativo: true,
    versao: 1,
    corpo: `# Procuração

{{nome_completo}}, {{nacionalidade}}, {{estado_civil}}, {{profissao}}, inscrito(a) no cadastro de pessoas físicas sob o n°. {{cpf}}, residente e domiciliado(a) na {{endereco}}, nº {{numero}}, no bairro {{bairro}} em {{cidade}}, {{estado}}, CEP {{cep}}, nomeia e constitui sua procuradora Dr.ª CLARISSA DE OLIVEIRA, OAB/MG 133.596, com escritório profissional à Rua Paracatu nº 277, sala 46, Bairro Barro Preto em Belo Horizonte - MG, a quem conferimos amplos e ilimitados poderes para, no foro civil, criminal, e na Justiça Federal ou Trabalhista, em qualquer autarquia, repartição, instância ou tribunal, representar-nos, propor ações, defender-nos nas que forem propostas, promover medidas preventivas ou assecuratórias dos nossos direitos e interesses, requerer o que se torne necessário, para o que desde já lhe conferimos os poderes contidos na cláusula "AD-JUDICIA ET EXTRA", especificados no parágrafo 2º (segundo) do art. 5º da Lei Nº 8.906, de 04 de julho de 1994, e mais os especiais de transigir e transacionar, desistir, firmar compromissos, fazer acordos, receber e dar quitação, remir e adjudicar, inclusive substabelecer os poderes desta no todo ou em parte. O presente mandato é outorgado em caráter irrevogável, nos termos mandatais do art. 683, do Código Civil Brasileiro de 2002, vigente. O que tudo será dado por nós como firme e valioso. Podendo ainda requerer os benefícios da Justiça Gratuita.

~ Belo Horizonte, MG, {{data_documento}}.

~ __________________________________________
{{nome_completo}}`,
  },

  {
    id: "declaracao-insuficiencia",
    nome: "Declaração de Insuficiência de Recursos",
    categoria: "Declarações",
    area: "Geral",
    ativo: true,
    versao: 1,
    corpo: `# Declaração de Insuficiência de Recursos

{{nome_completo}}, {{nacionalidade}}, {{estado_civil}}, {{profissao}}, inscrito(a) no cadastro de pessoas físicas sob o n°. {{cpf}}, residente e domiciliado(a) na {{endereco}}, nº {{numero}}, no bairro {{bairro}} em {{cidade}}, {{estado}}, CEP {{cep}}, DECLARO, nos termos da Lei nº 7.115, de 29 de agosto de 1983 e, para os devidos fins, de que sou pobre na acepção jurídica do termo, não dispondo de condições econômicas para custear as despesas judiciais, custas ou taxas judiciárias, sem sacrifício do sustento meu e de minha família.

Por ser a expressão da verdade, assumindo inteira responsabilidade pelas declarações acima sob as penas da lei, assino a presente declaração para que produza seus efeitos legais.

~ Belo Horizonte, MG, {{data_documento}}.

~ __________________________________________
{{nome_completo}}`,
  },

  {
    id: "contrato-honorarios-trabalhista",
    nome: "Contrato de Honorários — Trabalhista",
    categoria: "Contratação",
    area: "Trabalhista",
    ativo: true,
    versao: 1,
    corpo: `# Contrato de Prestação de Serviços

Contrato que firma acordo de prestação de serviços entre as seguintes partes, de um lado, como CONTRATADO a advogada Dra. CLARISSA DE OLIVEIRA inscrita na OAB/MG 133.596 e CLARISSA OLIVEIRA SOCIEDADE DE ADVOGADOS, inscrita no CNPJ sob o nº 52.831.026/0001-85, com escritório profissional em Belo Horizonte – MG, na Rua Paracatu, n°. 277, sala 46, Bairro: Barro Preto, CEP: 30.180.090, e de outro lado, como CONTRATANTE: {{nome_completo}}, {{nacionalidade}}, {{estado_civil}}, inscrito(a) no cadastro de pessoas físicas sob o nº {{cpf}}, nascido(a) em {{data_nascimento}}, residente e domiciliado(a) a {{endereco}}, nº {{numero}}, bairro {{bairro}}, {{cidade}}, CEP {{cep}}, mediante as cláusulas e condições seguintes:

## 1ª) DOS SERVIÇOS CONTRATADOS
O Advogado CONTRATADO compromete-se, com todos os CONTRATANTES: Prestar serviços profissionais na defesa dos direitos desincumbindo com zelo os seus encargos, em qualquer juízo, Instância ou Tribunal, ou fora deles, na esfera TRABALHISTA, devendo a propositura de outras ações ser objeto de acordo específico. Os serviços contratados serão devidos até o trânsito em julgado da decisão (arquivamento).

## 2ª) DOS HONORÁRIOS
Em remuneração desses serviços, o CONTRATADO receberá do CONTRATANTE os honorários líquidos e certos do valor equivalente a 30% (TRINTA POR CENTO) do valor total obtido com o processo.
§ 1º: Nas hipóteses de rescisão indireta e/ou reversão de justa causa será devido ao CONTRATADO ainda o pagamento de honorários correspondentes a 15% (quinze por cento) sobre quaisquer valores depositados na conta vinculada do FGTS do CONTRATANTE e/ou liberação judicial do saldo existente na referida conta.
§ 3º: Havendo acordo entre o CONTRATANTE e a parte contrária, os honorários devidos ao CONTRATADO serão calculados sobre o proveito econômico auferido pelo CONTRATANTE.
§ 4º: Fica o CONTRATADO autorizado desde já a fazer a retenção de seus honorários quando do recebimento de valores devidos ao CONTRATANTE, advindos de êxito da demanda, ainda que parcial.
§ 5º: No caso de contratação de honorários antecipadamente, havendo atraso no pagamento ensejará multa no valor de 20% (vinte por cento) do valor devido e juros de mora de 1% (um por cento) ao mês, devidamente atualizados. Caso a mora seja superior a 30 (trinta) dias, salvo ajuste contrário, este contrato será rescindido de pleno direito, independentemente de qualquer medida judicial ou extrajudicial, considerando-se vencidas as demais obrigações vincendas, que serão exigidas de imediato.
§ 6º: Fica ciente o contratante que, perdendo a ação, ainda que de forma parcial, será responsabilizado pelo pagamento dos honorários advocatícios (sucumbenciais) da parte contrária e, em caso de improcedência da perícia técnica, este também será responsável pelo pagamento dos honorários periciais arbitrados judicialmente.
§ 7º: Os honorários de sucumbência pertencem ao CONTRATADO e não se confundem com os honorários contratuais aqui tratados.
§ 8º: Em caso de extinção do processo ou indeferimento dos pedidos ocasionados pela ausência do contratante às audiências, será devido o pagamento de 20% (vinte por cento) do valor da ação, a título de honorários.
§ 9º: O repasse ao CONTRATANTE dos créditos decorrentes da ação ocorrerá somente às sextas-feiras.

## 3ª) DAS DESPESAS
Todas as despesas efetuadas pelo CONTRATADO, mesmo que indiretamente relacionadas com a sua atuação, incluindo cópias, digitalizações, envio de correspondência, emolumentos, viagens, estacionamento, custas, preparo e demais gastos de natureza diversa da verba honorária, ficarão às expensas do CONTRATANTE, ainda que adiantadas pelo CONTRATADO.
Parágrafo Primeiro: A elaboração dos cálculos de liquidação é realizada por profissional especialista, cujo custo será devido na proporção de 2% (dois por cento) sobre o valor líquido auferido na demanda, observado o mínimo de R$ 500,00 (quinhentos reais), correndo às expensas do CONTRATANTE.
Parágrafo Segundo: Havendo necessidade de contratação de outros profissionais no curso do processo, o CONTRATADO elaborará substabelecimento, indicando advogado de sua confiança, correndo as despesas decorrentes desta delegação às expensas do CONTRATANTE.

## 4ª) DA VIGÊNCIA E DA RESCISÃO
O presente contrato tem vigência até o adimplemento das obrigações ajustadas.
Parágrafo único: Na hipótese de rescisão antecipada pelo CONTRATANTE, este deverá pagar todos os valores pactuados, sendo que os valores pró-êxito e os honorários sucumbenciais serão devidos no percentual correspondente à parcela dos serviços executados, conforme abaixo: 20% (vinte por cento) quando já distribuída a demanda judicial; 25% (vinte e cinco por cento) quando já realizada audiência de instrução e julgamento; 28% (vinte e oito por cento) quando interpostos recursos ou embargos de declaração; 30% (trinta por cento) após praticados os atos expressos na alínea "C".

## 5ª) DA DESISTÊNCIA
Em caso de desistência de interposição da demanda em até 07 (sete) dias, o CONTRATANTE ficará isento de honorários; após esse prazo, será devido ao CONTRATADO o valor de 01 (um) salário mínimo a título de honorários, a serem pagos em até 05 (cinco) dias úteis.

## 6ª) DA RESPONSABILIDADE
O contratante, visando o melhor resultado possível, compromete-se a: fornecer todos os elementos e informações necessários à instrução da ação, narrando os fatos de forma adequada e verdadeira; manter seus dados atualizados, informando imediatamente, pelo telefone (31) 99705-2805, toda e qualquer alteração de endereço, telefone ou e-mail; caso necessite de prova testemunhal, indicar 3 (três) testemunhas até 30 (trinta) dias antes da audiência; comparecer em todas as audiências, perícias ou reuniões; notificar o Contratado de qualquer alteração significativa; entregar ao Contratado todos os documentos necessários até 10 (dez) dias após a assinatura deste contrato.

## 7ª) CLÁUSULA DE COMUNICAÇÃO E CRONOGRAMA DE REUNIÕES
Comunicação via WhatsApp: as partes concordam em utilizar o WhatsApp como meio principal de comunicação para informes de andamento e dúvidas rotineiras, no horário comercial das 8h às 18h, de segunda a sexta-feira. O número oficial de atendimento do escritório é (31) 99705-2805, sendo recomendado que qualquer contato feito por número diferente seja desconsiderado e reportado ao CONTRATADO.
§ 1º Cronograma de Reuniões: a) Reuniões antes das audiências: o CONTRATADO notificará o CONTRATANTE com ao menos 24 horas de antecedência; b) Reuniões adicionais solicitadas pelo advogado: sem custo adicional; c) Reuniões adicionais solicitadas pelo cliente: agendadas com 24 horas de antecedência, com custo adicional de R$ 200,00 por reunião.
§ 3º Disponibilidade: ambas as partes comprometem-se a manter disponibilidade para reuniões urgentes, respeitando a notificação prévia.
§ 4º Não haverá cobrança de honorários adicionais por reuniões de emergência convocadas pelo CONTRATADO em resposta a exigências do processo.

## 8ª) DO PRAZO PARA CONFECÇÃO
O prazo para confecção da demanda judicial é de 15 (quinze) a 30 (trinta) dias, respeitados os prazos legalmente estabelecidos.

## 9ª) DA LEI GERAL DE PROTEÇÃO DE DADOS
As partes declaram ciência de que os dados fornecidos serão utilizados exclusivamente para o cumprimento das obrigações contratuais, em conformidade com a Lei nº 13.709/2018.

## 10ª) DA ASSINATURA ELETRÔNICA
Este contrato poderá ser assinado digitalmente, mediante plataforma de assinatura eletrônica certificada, com a mesma validade jurídica da via física.

## 11ª) DO FORO
Elegem as partes o foro da Comarca de Belo Horizonte/MG para dirimir dúvidas sobre este contrato, podendo o CONTRATADO, em caso de execução, optar pelo foro da residência do cliente.

E por estarem assim justos e contratados, firmam o presente em duas vias, perante as testemunhas.

~ Belo Horizonte, {{data_documento}}.

~ _____________________________________________
{{nome_completo}} — Contratante

~ _____________________________________________
CLARISSA DE OLIVEIRA (representando a Sociedade de Advogados)

Testemunha 1: _________________________  CPF: ______________
Testemunha 2: _________________________  CPF: ______________`,
  },

  {
    id: "contrato-previdenciario",
    nome: "Contrato de Prestação de Serviços — Previdenciário",
    categoria: "Contratação",
    area: "Previdenciário",
    ativo: true,
    versao: 1,
    corpo: `# Contrato de Prestação de Serviços Jurídicos

CONTRATANTE: {{nome_completo}}, {{nacionalidade}}, {{estado_civil}}, inscrito(a) no Cadastro de Pessoas Físicas sob o n°. {{cpf}}, residente e domiciliado(a) na {{endereco}}, nº {{numero}}, {{bairro}}, {{cidade}}, CEP {{cep}}.

CONTRATADA: Dra. CLARISSA DE OLIVEIRA, inscrita na OAB/MG 133.596, representando CLARISSA OLIVEIRA SOCIEDADE INDIVIDUAL DE ADVOCACIA, inscrita no CNPJ sob o nº 52.831.026/0001-85, com escritório profissional em Belo Horizonte – MG, na Rua Paracatu, n°. 277, sala 46, Bairro: Barro Preto, CEP: 30.180.090.

## OBJETO DO CONTRATO
CLÁUSULA PRIMEIRA: O Contratante contratou os serviços profissionais do Contratado para interposição de processo administrativo objetivando CONCESSÃO DE BENEFÍCIO PREVIDENCIÁRIO DE APOSENTADORIA E/OU AVERBAÇÃO DE TEMPO DE CONTRIBUIÇÃO, até o trâmite final do processo.

CLÁUSULA SEGUNDA: O Contratado se compromete a: realizar os serviços agendados no INSS, sem reagendá-los ou adiá-los injustificadamente; aplicar todo o seu conhecimento jurídico e empenho a fim de obter o melhor resultado possível, em consonância com os objetivos da cláusula primeira; não postergar injustificadamente o andamento processual.

## DEVERES DO CONTRATANTE
CLÁUSULA TERCEIRA: O Contratante, visando o melhor resultado possível do processo previdenciário, compromete-se a: fornecer todas as informações necessárias ao deslinde processual; manter seus dados atualizados perante o Contratado, informando imediatamente, pelo e-mail clarissaoliveira.adv@gmail.com, toda e qualquer alteração de endereço, telefone ou e-mail; caso necessite de prova testemunhal, indicar 3 testemunhas até 30 dias antes da audiência, justificação judicial ou administrativa; comparecer em todas as audiências, justificações judiciais ou administrativas; notificar o Contratado de qualquer alteração contributiva (desligamento do emprego, novo emprego, modificação nas contribuições, recebimento de benefício previdenciário etc.); entregar ao Contratado todos os documentos necessários para o protocolo administrativo no INSS até 30 dias antes da data de atendimento agendada.
§ Único: O descumprimento do dever da alínea "f" desta cláusula autoriza o reagendamento do protocolo administrativo e a aplicação da multa prevista na cláusula quinta.

## HONORÁRIOS ADVOCATÍCIOS
CLÁUSULA QUARTA: Em remuneração aos serviços prestados, fica o Contratante obrigado, de forma irrevogável e irretratável, ao pagamento de honorários advocatícios em favor do Contratado, da seguinte forma:
Via Administrativa:
a) O equivalente a 02 (dois) salários do benefício que a CONTRATANTE vier a receber, quando e se receber, podendo ser divididos em seis parcelas iguais e sucessivas de 30 dias após o vencimento da primeira, com pagamento através de boleto bancário;
b) O equivalente a 15% (quinze por cento) de honorários sobre o proveito econômico do processo, com vencimento na data do recebimento.
§ 1º: O proveito econômico, sobre o qual incidem os honorários, é o valor bruto composto por todas as parcelas vencidas e vincendas, juros e atualização monetária calculados até a data do trânsito em julgado, sem dedução de benefícios previdenciários já recebidos. Não se confunde com o valor líquido recebido por meio de RPV ou Precatório.
§ 2º: Os honorários incluídos na condenação por arbitramento ou sucumbência pertencem ao CONTRATADO, sem qualquer redução dos honorários contratuais.
§ 3º: Caso a contratada opte por separar a parte do valor devido a título de honorários, juntará o contrato de prestação de serviço no processo para que se cumpra sua finalidade.
Parágrafo: Caso os valores não sejam pagos no prazo, sofrerão multa contratual de 10% do montante, além de correção monetária pelo IGP-M e juros moratórios de 1% ao mês.

## IMPLEMENTAÇÃO
CLÁUSULA QUINTA: Fica assegurado ao advogado o direito à exclusividade na implementação do benefício objeto deste contrato junto aos órgãos competentes, após decisão favorável, salvo quitação integral antecipada pelo(a) contratante da parcela de êxito que cabe à contratada. Para tanto, fica o contratante obrigado a fornecer quaisquer informações e/ou documentos necessários.

## CUSTAS E DESPESAS
CLÁUSULA SEXTA: As despesas efetuadas pelo Contratado, decorrentes direta ou indiretamente do processo administrativo e/ou judicial, serão reembolsadas pelo Contratante ao final do processo de conhecimento, mediante apresentação de demonstrativo consolidado acompanhado dos respectivos comprovantes.
§ 1º: As despesas incluem custas judiciais, viagens, fotocópias, autenticações, expedição de certidões, assistentes técnicos, deslocamentos e quaisquer outras decorrentes dos serviços prestados.
§ 2º: A não apresentação do demonstrativo ou dos comprovantes desobriga o Contratante de reembolsar as respectivas despesas.

## MULTA
CLÁUSULA SÉTIMA: O descumprimento dos deveres do Contratado ou do Contratante, estabelecidos nas cláusulas segunda e terceira, implicará multa contratual de R$ 2.000,00 (dois mil reais), com vencimento no trânsito em julgado do processo.
CLÁUSULA OITAVA: O não pagamento dos honorários nas datas aprazadas importará multa contratual de 10% (dez por cento) sobre os valores devidos, atualização monetária pelo INPC e juros moratórios de 1% ao mês.

## RESCISÃO CONTRATUAL
CLÁUSULA NONA: Em caso de desistência da ação judicial, expressa ou tácita, será devido ao Contratado: o valor de R$ 2.000,00 (dois mil reais) se a desistência for antes do ajuizamento; o valor integral dos honorários advocatícios (cláusula quarta) se a desistência for após o ajuizamento.
§ Único: A ausência do Contratante em audiências será considerada desistência do processo.
CLÁUSULA DÉCIMA: A parte que descumprir qualquer das cláusulas dará à outra o direito de rescindir o presente instrumento, mediante aviso prévio de 15 (quinze) dias.

## RESILIÇÃO CONTRATUAL
CLÁUSULA DÉCIMA PRIMEIRA: A resilição deve ser comunicada expressamente com aviso prévio de 15 (quinze) dias. Na resilição unilateral do Contratante, serão devidos os honorários proporcionalmente ao trabalho já desenvolvido. Na resilição unilateral do Contratado, será devido ao Contratante o valor de 5% (cinco por cento) do valor da causa.

## FORO
CLÁUSULA DÉCIMA SEGUNDA: Fica eleito o Foro da Circunscrição Judiciária de Belo Horizonte/MG para dirimir qualquer questão entre as partes, renunciando desde já as partes a qualquer outro foro, por mais privilegiado que seja.

~ Belo Horizonte, {{data_documento}}.

~ _____________________________________________
{{nome_completo}} — Contratante

~ _____________________________________________
CLARISSA DE OLIVEIRA — advogada

Testemunha 1: _________________________  CPF: ______________
Testemunha 2: _________________________  CPF: ______________`,
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

CLARISSA DE OLIVEIRA, advogada inscrita na OAB/MG 133.596, com escritório em Rua Paracatu, nº 277, sala 46, Barro Preto, Belo Horizonte/MG, onde recebe intimações, vem, respeitosamente, à presença de Vossa Excelência, na qualidade de patrona de {{nome_completo}}, conforme procuração anexa, requerer sua HABILITAÇÃO nos autos em epígrafe.

Requer, ainda, que todas as futuras intimações e publicações sejam realizadas exclusivamente em nome da subscritora, sob pena de nulidade.

Termos em que, pede deferimento.

~ Belo Horizonte, {{data_documento}}.

~ _____________________________________________
CLARISSA DE OLIVEIRA — OAB/MG 133.596`,
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

~ Belo Horizonte, {{data_documento}}.

~ _____________________________________________
CLARISSA DE OLIVEIRA — OAB/MG 133.596`,
  },
];

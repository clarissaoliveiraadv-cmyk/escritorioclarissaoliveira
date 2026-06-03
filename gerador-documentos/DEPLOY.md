# Publicar o app como site protegido (Cloudflare Pages + Access)

Objetivo: colocar o Gerador de Documentos no ar com um **link**, acessível de
qualquer computador/celular, porém **protegido por login de e-mail** — só quem
você autorizar consegue entrar. Tudo no plano **gratuito**.

> Por que Cloudflare e não GitHub Pages? O GitHub Pages não tem senha (todo
> site é público). O Cloudflare oferece o mesmo hospedagem grátis **+** uma
> camada de login (Cloudflare Access) sem custo para até 50 pessoas.

---

## Visão geral (3 etapas)

1. **Hospedar** o app no Cloudflare Pages (conectado a este repositório do GitHub).
2. **Proteger** o site com Cloudflare Access (login por código no e-mail).
3. **Autorizar** os e-mails da equipe.

Tempo estimado: ~10 a 15 minutos.

---

## Etapa 1 — Hospedar no Cloudflare Pages

1. Crie uma conta grátis em **https://dash.cloudflare.com** (se ainda não tiver).
2. No menu lateral, vá em **Workers & Pages** → **Create application** → aba
   **Pages** → **Connect to Git**.
3. Autorize o GitHub e selecione o repositório
   **`escritorioclarissaoliveira`**.
4. Em **Set up builds and deployments**, configure assim:
   - **Production branch:** `main` (veja a observação abaixo se ainda estiver na
     branch de desenvolvimento).
   - **Framework preset:** `None`.
   - **Build command:** deixe **em branco**.
   - **Build output directory:** `gerador-documentos`
5. Clique em **Save and Deploy**. Em ~1 minuto o site fica no ar num endereço do
   tipo `https://escritorioclarissaoliveira.pages.dev`.

> **Observação sobre a branch:** o app foi desenvolvido na branch
> `claude/wizardly-lovelace-smWxd`. Para publicar a partir da `main`, é preciso
> juntar (merge) o código nela — peça ao Claude para **abrir um Pull Request**.
> Alternativamente, no passo 4 você pode escolher a própria branch
> `claude/wizardly-lovelace-smWxd` como *Production branch*.

---

## Etapa 2 — Proteger com Cloudflare Access (login por e-mail)

1. No painel da Cloudflare, abra **Zero Trust** (pode pedir para criar um time —
   escolha o plano **Free**).
2. Vá em **Access** → **Applications** → **Add an application** →
   **Self-hosted**.
3. Preencha:
   - **Application name:** `Gerador de Documentos`
   - **Session duration:** ex. `24 hours` (de quanto em quanto tempo pede login).
   - **Application domain:** o endereço do seu site Pages, ex.
     `escritorioclarissaoliveira.pages.dev` (deixe o caminho vazio para proteger
     o site inteiro).
4. Avance para **Add policies** e crie uma política:
   - **Policy name:** `Equipe autorizada`
   - **Action:** `Allow`
   - **Configure rules → Include →** selecione **Emails** e digite os e-mails
     autorizados (ex.: `clarissaoliveira.adv@gmail.com`). Pode adicionar vários,
     ou usar **Emails ending in** `@seudominio.com` se a equipe tiver domínio
     próprio.
5. Em **Login methods**, mantenha **One-time PIN** ativado (a Cloudflare envia um
   código por e-mail — não precisa criar senha).
6. Salve a aplicação.

Pronto. A partir de agora, ao abrir o link do site, a pessoa digita o e-mail,
recebe um **código de uso único** e entra. Quem não estiver na lista é barrado.

---

## Etapa 3 — Adicionar ou remover pessoas

Sempre que precisar liberar/retirar acesso:

- **Zero Trust → Access → Applications →** `Gerador de Documentos` → **Policies**
  → edite a lista de e-mails.

---

## Atualizações automáticas

Toda vez que o código mudar no repositório (na branch de produção), o Cloudflare
Pages **republica o site sozinho**. Não precisa fazer nada manual.

---

## Lembretes importantes

- Os **dados dos clientes** continuam salvos **no navegador de cada
  computador** (localStorage). Eles **não** sobem para o site nem para a
  Cloudflare. Ou seja: cada máquina tem seus próprios cadastros.
  - Para usar os mesmos cadastros em vários computadores, será preciso, no
    futuro, um banco de dados central (posso adicionar depois) ou usar o botão
    de **Exportar/Importar backup** (posso implementar).
- O que fica publicado são os **modelos** (textos dos documentos) e o **timbre**.
  Por isso o login do Access é importante para mantê-los privados.
- Custo: **R$ 0** nos planos gratuitos de Pages e Zero Trust (até 50 usuários).

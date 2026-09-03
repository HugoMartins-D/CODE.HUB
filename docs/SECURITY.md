# Auditoria de segurança

Referência: OWASP Top 10:2025, ASVS 5.0, OWASP Top 10 for LLM Applications.
Escopo: todo o `src/`, a configuração de build e o caminho de deploy na Vercel.
Data: 2026-09-03.

A CODE.HUB é uma SPA sem servidor próprio — todo controle de acesso é do
Appwrite. Isso significa que **uma parte das defesas não mora neste
repositório**, e por isso os achados estão separados por onde a correção vive.

Cada achado abaixo foi verificado até o ponto onde a exploração é possível ou
não. Onde a decisão depende de configuração que não está no código, isso está
dito explicitamente em vez de assumido.

---

## Corrigidos neste ciclo

### 1. Nenhum header de segurança no deploy — **Alto** (A02)

`vercel.json` não definia nenhum header. Consequências verificadas:

- **Clickjacking:** sem `frame-ancestors` nem `X-Frame-Options`, a aplicação
  inteira era embutível em iframe de terceiro. As ações destrutivas — excluir
  publicação, editar perfil — são cliques únicos sem confirmação.
- **Sem CSP:** qualquer XSS futuro, ou um pacote comprometido em runtime, teria
  alcance irrestrito para exfiltrar dados. Isso pesa mais aqui do que num app
  comum por causa do achado #3.
- **Referrer vazando:** o path completo (`/publicacao/:id`, `/perfil/:username`)
  ia para todo site externo linkado num perfil.

**Corrigido.** CSP, `frame-ancestors 'none'`, `X-Frame-Options`, `nosniff`,
`Referrer-Policy`, `Permissions-Policy` e HSTS em `vercel.json`.

> A CSP libera `https://fra.cloud.appwrite.io`. Trocar
> `VITE_APPWRITE_ENDPOINT` sem atualizar a CSP quebra a aplicação em produção.

### 2. Campo `website` sem allowlist de esquema — **Baixo** (defesa em profundidade)

`ProfileEditScreen` gravava `website: website.trim()` sem validação, e
`ScreenProfile` renderizava `href={profile.website}` cru.

**Não era explorável.** Verificado em teste: o React 19 substitui um `href`
`javascript:` por `javascript:throw new Error('React has blocked a javascript:
URL as a security precaution…')`. O vetor clássico de XSS armazenado por
`javascript:` está fechado pelo framework.

O problema real era a dependência: a garantia era do React, não da aplicação, e
sumiria numa renderização fora do React, num `window.open`, ou numa mudança de
comportamento do framework.

**Corrigido.** `sanitizeWebsite()` em `src/lib/profile.ts` reduz o valor a uma
URL `http`/`https` absoluta, aplicado na escrita e na leitura. Testes em
`src/lib/profile.test.ts`.

---

## Dependem do console do Appwrite

Não dá para corrigir por código neste repositório. São os itens de maior
impacto da auditoria.

### 3. A sessão fica em `localStorage` — **Alto** (A04, A07 / ASVS 7.2, 14.2)

**Confirmado**, não é teórico. O endpoint (`fra.cloud.appwrite.io`) está num
domínio diferente do da aplicação, então o cookie de sessão é de terceiro. O
SDK detecta isso e cai para `localStorage`, sob a chave `cookieFallback` — o
próprio SDK emite o aviso:

> `localStorage for session management. Increase your security by adding a
custom domain as your API endpoint.`

O segredo de sessão passa a ser legível por qualquer JavaScript da origem. Um
XSS deixa de ser "roubo de dados da tela" e vira **tomada de conta completa**, e
a sessão não morre ao fechar o navegador.

**Correção:** apontar um domínio próprio (ex.: `api.codehub.dev`) como endpoint
do Appwrite. O cookie volta a ser primeira-parte e `httpOnly`, fora do alcance
de JavaScript. Depois disso, atualizar o host na CSP do `vercel.json`.

### 4. Confirmar o _Document Security_ em todas as tabelas — **Alto se estiver desligado** (A01)

O código grava permissões por linha corretamente — `posts` e `profiles` com
`update`/`delete` só para o dono, `messages` por participante, `notifications`
com leitura só para o destinatário.

**Essas permissões só valem se _Document Security_ estiver ligado na tabela.**
Desligado, o Appwrite ignora a permissão da linha e aplica só a da coleção — e
se a coleção concede escrita ao papel `users`, **qualquer pessoa autenticada
edita ou apaga a publicação e o perfil de qualquer outra**.

Não dá para determinar isso pelo código. Um sinal a investigar: as linhas são
criadas **sem** permissão de leitura e mesmo assim o feed carrega, o que indica
leitura concedida no nível da coleção.

A checagem de dono em `deletePost()` é de UX, não de segurança — ela roda no
cliente e é contornável.

**Ação:** no console, para `posts`, `profiles`, `messages`, `conversations` e
`notifications`, confirmar que Document Security está **ligado** e que a
permissão de coleção concede a `users` apenas `create` e `read` — nunca
`update` ou `delete`.

### 5. Política de senha — **Médio** (ASVS 6.2.4, 6.2.12)

A aplicação exige 8 caracteres (`src/lib/auth.ts`), o mínimo do ASVS L1. Falta
o que o Appwrite oferece pronto e precisa ser ligado no console:

- **Password dictionary** — bloqueia as senhas mais vazadas (ASVS 6.2.4 é L1,
  ou seja, o piso).
- **Personal data check** — impede senha contendo nome ou email.
- **Password history** — impede reuso.

A aplicação nunca vê, guarda nem faz hash de senha; isso é todo do Appwrite.

---

## Depende de backend

### 6. Notificações são forjáveis — **Médio** (A01, A06)

`createNotification()` é chamado pelo cliente do **ator** e grava `actorId`,
`actorName`, `title`, `body` e `href` como vêm — nada amarra `actorId` à
identidade autenticada. Com a permissão de `create` que o fluxo exige, dá para
gravar uma notificação para qualquer destinatário, assinada como qualquer
pessoa, com o texto que quiser. Vetor de phishing dentro do produto.

`ScreenNotificacoes` faz `navigate(notification.href)` com esse valor. Isso
**não** é XSS: o React Router trata a string como path interno, e um
`pushState` para outra origem é bloqueado pelo navegador. O problema é a
falsificação, não a navegação.

**Correção:** mover a criação de notificação para uma Appwrite Function, que
deriva `actorId` da sessão e monta `title`/`body`/`href` no servidor. Enquanto
isso não existe, tirar `create` de `users` na coleção `notifications` desliga o
vetor ao custo de desligar a funcionalidade.

---

## Verificados e sem achado

- **A03 Cadeia de suprimentos.** `npm audit` com 0 vulnerabilidades. Lockfile v3
  com hash de integridade por pacote e `npm ci` no deploy — a árvore é
  reproduzível. Único pacote com script de instalação é o `fsevents`, opcional e
  restrito a macOS. Nenhuma dependência vem de git ou tarball.
- **A05 Injeção.** Sem SQL, sem shell, sem `eval`, sem `new Function`, sem
  `innerHTML` e sem `dangerouslySetInnerHTML` em todo o `src/`. As consultas
  usam o construtor `Query` do Appwrite, que serializa os valores em vez de
  concatenar.
- **Controle de acesso em Mensagens.** `conversations` e `messages` recebem
  `read`/`update`/`delete` por participante. Sujeito ao mesmo pré-requisito do
  achado #4.
- **Segredos no código.** Nenhum. O project ID do Appwrite no fallback de
  `src/lib/appwrite.ts` é público por design — é identificador, não credencial.
  Todo `VITE_*` vai para o bundle e é visível; nenhum guarda segredo hoje, e
  essa propriedade precisa continuar valendo.
- **Enumeração de conta no login.** `authMessage()` devolve "Email ou senha
  incorretos." para 401, sem distinguir os casos.
- **OAuth.** `loginWithGithub()` monta `success`/`failure` a partir de
  `window.location.origin`, não de parâmetro da URL — sem redirect aberto. Os
  escopos pedidos (`read:user`, `user:email`) são o mínimo do fluxo.
- **Upload.** Tipo e tamanho (5 MB) validados nas duas pontas do fluxo, e os
  arquivos órfãos são apagados quando a gravação da linha falha.
- **LLM / Agentic.** A aplicação não chama modelo nem expõe ferramenta de
  agente. As categorias LLM01–LLM10 e ASI01–ASI10 não se aplicam.

---

## Aceitos

- **Enumeração de conta no cadastro** (Baixo). O 409 do Appwrite vira "Já existe
  uma conta com esse email." Some com uma mensagem genérica + confirmação por
  email, ao custo de piorar bastante o cadastro. Tradeoff consciente.
- **`avatarPosition` de terceiro em `style`** (Informativo). O valor entra em
  `style={{ objectPosition }}` no `PostCard`. O React atribui via propriedade,
  então não há como escapar para outra declaração CSS, e `objectPosition` não
  carrega URL. A aplicação nem escreve esse campo hoje — só uma escrita direta na
  API o preencheria. Efeito máximo: avatar torto.

---

## Ordem de execução

Os achados #3 a #6 estão divididos em sprints, com o que fazer e o critério de
aceite de cada um, em [SPRINTS.md](SPRINTS.md).

O Sprint 1 concentra #3, #4 e #5 — os três são configuração de console e juntos
decidem se o controle de acesso do produto existe de fato. O #6 é o Sprint 2,
porque depende de escrever uma Appwrite Function.

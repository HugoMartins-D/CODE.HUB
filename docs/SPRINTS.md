# Correções pendentes por sprint

Tudo que a auditoria de dependências e a de segurança deixaram em aberto,
ordenado por impacto. Origem de cada item: [SECURITY.md](SECURITY.md) e as
pendências de [CHANGELOG.md](CHANGELOG.md).

A ordem não é negociável entre sprints. O Sprint 1 é o que decide se o controle
de acesso do produto existe de fato — enquanto ele não fechar, qualquer trabalho
nos outros é construir em cima de uma base que não sustenta.

| Sprint | Objetivo                                  | Onde vive a correção  | Bloqueia |
| ------ | ----------------------------------------- | --------------------- | -------- |
| 1      | Fechar o controle de acesso               | Console do Appwrite   | Uso real |
| 2      | Tirar do cliente a autoridade sobre dados | Appwrite Function     | —        |
| 3      | Preparar o lançamento                     | Repositório + produto | Launch   |

---

## Sprint 1 — Fechar o controle de acesso

**Nada aqui é código deste repositório.** São três configurações no console do
Appwrite, mais uma linha no `vercel.json`. É o sprint mais curto em esforço e o
único que muda se o produto pode ou não ir para as mãos de alguém.

### 1.1 Confirmar _Document Security_ nas cinco tabelas — Alto

Origem: SECURITY #4.

O código grava as permissões por linha corretamente, mas elas só valem com
_Document Security_ ligado na tabela. Desligado, o Appwrite aplica só a
permissão da coleção — e se ela concede escrita ao papel `users`, qualquer
pessoa autenticada edita ou apaga a publicação e o perfil de qualquer outra.

**Fazer:** em `posts`, `profiles`, `messages`, `conversations` e
`notifications`, ligar _Document Security_ e reduzir a permissão de coleção a
`create` + `read` para `users`. Nunca `update` ou `delete` no nível da coleção.

**Aceite** — com a Pessoa A logada, tentar apagar uma publicação da Pessoa B
direto na API. O esperado é `401`, não `204`:

```bash
curl -i -X DELETE \
  "$VITE_APPWRITE_ENDPOINT/tablesdb/codehub/tables/posts/rows/$POST_DA_PESSOA_B" \
  -H "X-Appwrite-Project: $VITE_APPWRITE_PROJECT_ID" \
  -H "X-Appwrite-Session: $SESSAO_DA_PESSOA_A"
```

Repetir para `profiles` com `PATCH`. Se qualquer um voltar `2xx`, o sprint não
fechou.

### 1.2 Domínio próprio no endpoint do Appwrite — Alto

Origem: SECURITY #3.

Hoje o endpoint está num domínio diferente do da aplicação, o cookie de sessão
é de terceiro, e o SDK cai para `localStorage['cookieFallback']`. O segredo de
sessão fica legível por qualquer JavaScript da origem — é o que transforma um
XSS futuro em tomada de conta completa.

**Fazer:**

1. Adicionar um domínio próprio (ex.: `api.codehub.dev`) como endpoint da API no
   console do Appwrite.
2. Apontar `VITE_APPWRITE_ENDPOINT` para ele nas variáveis da Vercel.
3. **Atualizar a CSP no `vercel.json`** — `connect-src` e `img-src` liberam
   `https://fra.cloud.appwrite.io` hoje. Sem essa troca, a aplicação para de
   carregar dados e imagens no mesmo deploy.

Os três passos vão juntos, no mesmo deploy. Fazer o 2 sem o 3 derruba produção.

**Aceite** — logar em produção e, no console do navegador:

```js
localStorage.getItem("cookieFallback"); // esperado: null
```

E confirmar em DevTools → Application → Cookies que o cookie de sessão aparece
como primeira-parte, com `HttpOnly` e `Secure` marcados.

### 1.3 Política de senha — Médio

Origem: SECURITY #5.

A aplicação exige 8 caracteres, o piso do ASVS L1. Falta o que o Appwrite já tem
pronto e só precisa ser ligado em Auth → Security:

- **Password dictionary** — bloqueia as senhas mais vazadas. É requisito L1
  (ASVS 6.2.4), ou seja, o mínimo, não o avançado.
- **Personal data check** — impede senha contendo nome ou email.
- **Password history** — impede reuso.

**Aceite:** tentar cadastrar com `senha123` e receber recusa do Appwrite.

---

## Sprint 2 — Tirar do cliente a autoridade sobre dados

### 2.1 Notificações via Appwrite Function — Médio

Origem: SECURITY #6.

`createNotification()` roda no cliente do ator e grava `actorId`, `actorName`,
`title`, `body` e `href` como vêm. Nada amarra `actorId` à sessão autenticada,
então dá para gravar uma notificação para qualquer destinatário, assinada como
qualquer pessoa, com o texto que quiser. É um vetor de phishing dentro do
produto.

**Fazer:** mover a criação para uma Appwrite Function que:

- deriva `actorId` da sessão que chamou, ignorando o que vier no corpo;
- recebe só `{ type, recipientId, targetId }` e monta `actorName`, `title`,
  `body` e `href` no servidor, a partir do Perfil e da Publicação reais;
- valida que o evento existe — que a reação, o comentário ou a Conexão de fato
  aconteceram — antes de gravar.

Feito isso, tirar `create` de `users` na coleção `notifications`: só a Function
escreve ali.

**Mitigação provisória**, se o sprint atrasar: tirar `create` de `users` já
desliga o vetor, ao custo de desligar a funcionalidade de notificação. Vale a
troca se o produto for aberto para fora antes da Function existir.

**Aceite** — com a sessão da Pessoa A, tentar gravar uma notificação assinada
como a Pessoa B:

```bash
curl -i -X POST \
  "$VITE_APPWRITE_ENDPOINT/tablesdb/codehub/tables/notifications/rows" \
  -H "X-Appwrite-Project: $VITE_APPWRITE_PROJECT_ID" \
  -H "X-Appwrite-Session: $SESSAO_DA_PESSOA_A" \
  -H "Content-Type: application/json" \
  -d '{"rowId":"unique()","data":{"actorId":"ID_DA_PESSOA_B","actorName":"Pessoa B","recipientId":"ID_DA_VITIMA","type":"follow","title":"…","body":"…","href":"/perfil/eu","createdAt":"2026-01-01T00:00:00.000Z","readAt":null}}'
```

Esperado: `401`. E o fluxo real de reagir, comentar e seguir continua gerando
notificação normalmente.

---

## Sprint 3 — Preparar o lançamento

Nada aqui é de segurança. São os dois itens que separam o estado atual de um
lançamento público.

### 3.1 Liberar a indexação — decisão de produto

Origem: pendências do CHANGELOG.

`.figma/make/site.json` tem `"robots": { "index": false }`. O plugin do Vite
traduz isso em `dist/robots.txt` com `Disallow: /` **e** numa
`<meta name="robots" content="noindex, nofollow">`. Em produção, o site sai
invisível para buscadores.

Faz sentido enquanto é preview. Vira `true` quando o lançamento for decidido —
é uma linha, mas a decisão é de produto, não de build.

**Aceite:** `curl https://<site>/robots.txt` não contém `Disallow: /`, e o
`index.html` servido não tem a meta `noindex`.

### 3.2 Code splitting por rota

Origem: pendências do CHANGELOG.

O bundle é um chunk único de 420 kB (122 kB gzip). Toda pessoa que abre a tela
de login baixa também o feed, o perfil, as mensagens e as notificações. O custo
cresce junto com as telas, e as telas de `src/imports/` são grandes.

**Fazer:** `React.lazy` + `Suspense` nas rotas de `src/App.tsx`, começando pelas
que já estão fora do fluxo de entrada — `/mensagens`, `/notificacoes`,
`/publicar` e as telas fora do MVP.

**Aceite:** o chunk de entrada cai abaixo de 150 kB antes do gzip, e
`npm run test:e2e` continua passando — o `Suspense` não pode introduzir uma
tela em branco no fluxo de cadastro.

### 3.3 Re-auditoria

Refazer a passagem do [SECURITY.md](SECURITY.md) depois que os Sprints 1 e 2
fecharem, e atualizar o relatório. Os achados #3 a #6 saem de "em aberto" só
com evidência dos critérios de aceite acima, não por terem sido implementados.

---

## Fora de sprint

Itens conscientemente aceitos na auditoria, registrados para não voltarem como
"achado novo" na próxima passagem: enumeração de conta no cadastro e
`avatarPosition` de terceiro em `style`. O raciocínio está em
[SECURITY.md](SECURITY.md), seção "Aceitos".

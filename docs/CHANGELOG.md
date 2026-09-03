# Registro de alterações

Contexto de tudo que mudou no projeto depois do MVP: o que foi alterado, por
que, e onde a decisão está registrada.

## Como este registro é mantido

- **Toda alteração entra aqui**, com o motivo. O diff explica o quê; este
  arquivo explica o porquê.
- **Alteração crítica vira pull request depois de feita.** Crítico é o que
  quebra o build, muda o deploy, mexe em dependência, ou tem impacto de
  segurança. O trabalho é feito e validado primeiro; o PR carrega o resultado
  já verificado, com o passo a passo da verificação na descrição.
- **O resto pode ir direto na branch de trabalho** — ajuste de UI, cópia,
  refino de teste — desde que `npm run check` passe.
- Antes de abrir qualquer PR, `npm run check` (ver [QUALITY.md](QUALITY.md)).

---

## 2026-09-03 — Segurança: headers de deploy e saneamento de URL

**PR:** `sec/hardening` · **Auditoria completa:** [SECURITY.md](SECURITY.md)

Auditoria OWASP Top 10:2025 / ASVS 5.0 sobre todo o `src/` e a configuração de
deploy. Dois achados foram corrigidos por código; o resto depende de
configuração no console do Appwrite ou de backend, e está documentado no
relatório.

### `vercel.json` — headers de segurança (A02: Security Misconfiguration)

O deploy não enviava **nenhum** header de segurança. Adicionados:

| Header                                             | Motivo                                                                                                                     |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `Content-Security-Policy`                          | Sem CSP, qualquer XSS futuro tem alcance total. A política restringe origens para script, estilo, fonte, imagem e conexão. |
| `frame-ancestors 'none'` + `X-Frame-Options: DENY` | A aplicação era totalmente embutível em iframe — clickjacking sobre os botões de publicar, seguir e excluir.               |
| `X-Content-Type-Options: nosniff`                  | Impede o navegador de reinterpretar o tipo de um arquivo servido do bucket.                                                |
| `Referrer-Policy: strict-origin-when-cross-origin` | O path de `/publicacao/:id` e `/perfil/:username` vazava para todo site externo linkado num perfil.                        |
| `Permissions-Policy`                               | Nega câmera, microfone e geolocalização, que a aplicação não usa.                                                          |
| `Strict-Transport-Security`                        | Cobre o caso de domínio próprio, onde a Vercel não envia HSTS sozinha.                                                     |

> **Atenção ao mexer no endpoint do Appwrite.** A CSP libera
> `https://fra.cloud.appwrite.io` em `connect-src` e `img-src`. Se
> `VITE_APPWRITE_ENDPOINT` apontar para outro host — inclusive um domínio
> próprio, que é a correção recomendada no relatório de segurança —, a CSP
> precisa ser atualizada junto ou a aplicação para de carregar dados e imagens.

### `src/lib/profile.ts` — saneamento do campo `website`

O campo era gravado e renderizado cru como `href` no Perfil público, sem
allowlist de esquema. Hoje o React 19 neutraliza `javascript:` em runtime
(verificado em teste), então **não era explorável** — mas a garantia era do
framework, não da aplicação.

`sanitizeWebsite()` reduz o valor a uma URL `http`/`https` absoluta e devolve
`""` para qualquer outra coisa. Aplicado nas duas pontas:

- na escrita (`saveProfile`), via `validateWebsite()`, que devolve erro à Pessoa;
- na leitura (`fromRow`), para neutralizar linhas gravadas antes desta validação.

Coberto por `src/lib/profile.test.ts`.

---

## 2026-09-03 — Conflitos de dependência e vazamentos no deploy

**PR:** [#1](https://github.com/HugoMartins-D/CODE.HUB/pull/1) · commit `4d38598`

Auditoria das dependências npm e do caminho de deploy na Vercel. `npm ci` +
`npm run build` reproduzidos em clean-room, a partir de `git archive HEAD`, sem
`node_modules` nem arquivos não versionados.

**As dependências em si estavam saudáveis** — lockfile sincronizado, `npm audit`
com 0 vulnerabilidades, nenhum peer dependency violado, todos os binários
nativos de `linux-x64-gnu` presentes no lock. Os problemas estavam em volta:

- **`.mise.toml` declarava pnpm 10.34.3 num projeto npm.** Com
  `package-lock.json` versionado, `packageManager: npm@10.9.8` e
  `installCommand: "npm ci"`, bastava um `pnpm install` acidental para nascer um
  `pnpm-lock.yaml` — a Vercel detecta o gerenciador pelo lockfile e passaria a
  resolver a árvore por um arquivo diferente do versionado. pnpm removido do
  toolchain, junto com o `.pnpm-store/v11/index.db` que estava commitado.
- **`public/.DS_Store` ia para produção.** O Vite copia `public/` inteiro para
  `dist/`; confirmado no build que o arquivo seria servido em
  `https://<site>/.DS_Store`. Removido junto com o da raiz, ambos ignorados.
- **CI rodava em Node 24** enquanto `engines.node` e a Vercel usam `22.x`.
  Alinhado para 22, para validar na mesma major que faz o deploy.
- **`"prepare": "husky"` podia derrubar o `npm ci`.** Fora de um repositório git
  — o caso do build da Vercel — já emitia `.git can't be found`; com
  `NODE_ENV=production` ou `--omit=dev` o binário não existe e o install inteiro
  falharia. Agora tolera falha.

---

## 2026-09-03 — Estabilização do build

**Commit:** `bad85c1` (entrou junto no PR [#1](https://github.com/HugoMartins-D/CODE.HUB/pull/1))

- `vercel.json` criado: framework, `npm ci`, `outputDirectory` e rewrite de SPA
  para as rotas do React Router funcionarem em acesso direto e refresh.
- `engines.node: "22.x"` e `packageManager: "npm@10.9.8"` fixados, para o
  runtime da Vercel não flutuar entre deploys.
- `pnpm-lock.yaml` duplicado removido.
- `vite.config.ts`: `__dirname` → `import.meta.dirname` (o arquivo é ESM e
  `__dirname` não existe lá) e import attributes no `site.json`.
- Avatar do Autor passou a aparecer no `PostCard`, com `avatarFileId` e
  `avatarPosition` hidratados a partir do Perfil.
- `cleanup()` no `afterEach` dos testes, para o DOM não vazar entre casos.
- E2E de cadastro passou a gerar email único por execução — o email fixo
  colidia na segunda rodada.

---

## Pendências conhecidas

Registradas aqui para não se perderem; nenhuma é regressão deste ciclo. Todas
estão divididas em sprints, com critério de aceite, em [SPRINTS.md](SPRINTS.md).

- **`robots: index: false`** em `.figma/make/site.json`. O plugin do Vite traduz
  isso em `dist/robots.txt` com `Disallow: /` **e** numa
  `<meta name="robots" content="noindex, nofollow">`. Em produção o site sai
  bloqueado para buscadores. Faz sentido enquanto é preview; precisa virar
  `true` antes do lançamento.
- **Bundle único de 420 kB** (122 kB gzip). Ainda aceitável, mas sem code
  splitting por rota o custo cresce junto com as telas.
- **Itens de segurança que dependem do console do Appwrite ou de backend** —
  ver [SECURITY.md](SECURITY.md).

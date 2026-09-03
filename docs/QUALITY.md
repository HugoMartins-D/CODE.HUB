# Qualidade do projeto

## Verificação completa

Execute antes de abrir um pull request:

```bash
npm run check
```

Esse comando verifica formatação, lint, tipos, testes unitários e build de produção.

## Comandos individuais

- `npm run format` — formata os arquivos com Prettier.
- `npm run format:check` — verifica a formatação sem alterar arquivos.
- `npm run lint` — executa ESLint sobre o código em `src`.
- `npm run typecheck` — verifica TypeScript.
- `npm run test` — executa testes unitários e de integração uma vez.
- `npm run test:watch` — mantém os testes em execução durante o desenvolvimento.
- `npm run test:e2e` — executa os testes de navegador com Playwright.

## Pre-commit

O hook em `.husky/pre-commit` formata arquivos preparados para commit e executa tipos e testes. Esta pasta ainda precisa ser inicializada como repositório Git para o Husky ativar o hook.

## Integração contínua

O workflow `.github/workflows/quality.yml` executa o pipeline completo e o teste ponta a ponta em pushes e pull requests quando o projeto estiver hospedado no GitHub.

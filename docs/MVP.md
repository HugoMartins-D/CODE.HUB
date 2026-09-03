# MVP da CODE.HUB

## Objetivo

Validar se devs, designers e vibe coders querem compartilhar publicamente o que estão construindo e criar conexões a partir desse trabalho.

O MVP deve permitir que uma nova Pessoa entre na plataforma, monte sua identidade, publique uma atualização e interaja com outras pessoas sem depender de dados simulados.

## Proposta de valor

> Mostre o que você está construindo, receba feedback e encontre pessoas para acompanhar ou colaborar.

## Público inicial

- Devs construindo projetos pessoais, open source ou produtos.
- Designers mostrando processos, protótipos e estudos.
- Vibe coders transformando ideias em produtos com ferramentas de IA.

O MVP não tentará personalizar a experiência para cada perfil profissional. Todos compartilham o mesmo modelo de Perfil, Publicação e interação.

## Fluxo principal

1. A Pessoa cria uma conta ou entra em uma conta existente.
2. Completa seu Perfil com nome, apresentação, bio, skills e link.
3. Cria uma Publicação com texto e até quatro imagens.
4. Encontra a Publicação no Feed.
5. Abre uma Publicação para reagir ou comentar.
6. Abre o Perfil de outro Autor e cria uma Conexão.
7. Volta depois e encontra seus dados e interações preservados.

## Escopo obrigatório

### Conta e sessão

- Cadastro por nome, email e senha.
- Login e logout.
- Sessão persistente e rotas privadas.
- Recuperação de senha.
- Uma Pessoa não pode acessar ou alterar dados privados de outra.

### Perfil

- Visualizar o próprio Perfil e o Perfil público de outra Pessoa.
- Editar nome, apresentação, bio, localização, link e skills.
- Exibir contagens de Publicações, seguidores e seguindo.
- Listar as Publicações do Perfil.

### Publicações e Feed

- Criar Publicação com até 500 caracteres.
- Anexar até quatro imagens.
- Visualizar Publicações no Feed em ordem da mais recente.
- Abrir uma Publicação individual por URL.
- O Autor pode excluir a própria Publicação.
- Estados de carregamento, vazio e erro.

### Interações

- Adicionar ou remover uma Reação.
- Criar e excluir o próprio Comentário.
- Criar ou remover uma Conexão com outra Pessoa.
- Exibir as contagens correspondentes.

### Mensagens e notificações

- Iniciar uma conversa privada com outra Pessoa.
- Enviar mensagens de texto e manter o histórico entre sessões.
- Exibir contagem de mensagens não lidas e marcar uma conversa como lida.
- Criar notificações para novas mensagens e futuras interações.
- Listar notificações e marcá-las individualmente ou em conjunto como lidas.

## Fora do MVP

- Chat em tempo real, presença online e indicador de digitação.
- Comunidades e grupos.
- Eventos e confirmação de presença.
- Vagas e candidaturas.
- Vídeos em Publicações.
- Feed algorítmico ou recomendação por IA.
- Perfis privados, bloqueio e silenciamento.
- Notificações push ou por email.
- Aplicativo nativo para iOS ou Android.
- Monetização.

As telas correspondentes podem permanecer no protótipo, mas devem ser marcadas como “em breve” ou removidas da navegação do MVP para não prometer funcionalidades indisponíveis.

## Regras principais

- Emails são únicos, sem diferenciar maiúsculas de minúsculas.
- Cada Perfil pertence a exatamente uma Pessoa.
- Uma Publicação possui exatamente um Autor.
- Uma Pessoa pode reagir apenas uma vez a cada Publicação.
- Uma Pessoa não pode criar uma Conexão consigo mesma.
- Somente o Autor pode editar ou excluir seu conteúdo.
- Excluir uma Publicação também remove suas mídias, Reações e Comentários.

## Rotas do MVP

| Rota                    | Acesso      | Finalidade                       |
| ----------------------- | ----------- | -------------------------------- |
| `/login`                | Público     | Entrar                           |
| `/cadastro`             | Público     | Criar conta                      |
| `/recuperar-senha`      | Público     | Recuperar acesso                 |
| `/feed`                 | Autenticado | Descobrir Publicações            |
| `/publicar`             | Autenticado | Criar Publicação                 |
| `/publicacao/:id`       | Autenticado | Ver e comentar em uma Publicação |
| `/perfil/:username`     | Autenticado | Ver um Perfil                    |
| `/configuracoes/perfil` | Autenticado | Editar o próprio Perfil          |

## Critérios de conclusão

O MVP está pronto para um teste fechado quando:

- Duas pessoas conseguem criar contas diferentes e seus dados não se misturam.
- Uma Pessoa consegue publicar imagens e outra consegue visualizar a Publicação.
- Reações, Comentários, Conexões e contagens sobrevivem a um recarregamento.
- URLs de Perfil e Publicação podem ser abertas e compartilhadas diretamente.
- A autorização impede alterações em conteúdo de terceiros.
- Cadastro, login, edição de Perfil e publicação funcionam em celular e desktop.
- O fluxo principal possui testes automatizados de ponta a ponta.
- Não existem senhas ou credenciais armazenadas no navegador pelo aplicativo.

## Métricas para o teste fechado

Medir durante as primeiras semanas:

- Percentual de novas Pessoas que completam o Perfil.
- Percentual de novas Pessoas que criam a primeira Publicação.
- Tempo até a primeira Publicação.
- Percentual de Publicações que recebem ao menos uma interação.
- Pessoas que retornam em 7 dias.

Uma boa meta inicial de aprendizado é conseguir entre 20 e 50 pessoas reais no teste, sem tratar esses números como metas definitivas de produto.

## Ordem de implementação

1. Backend, autenticação e modelo de dados.
2. Roteamento e proteção de rotas.
3. Perfis multiusuário.
4. Publicação com upload de imagens.
5. Feed persistente e página individual.
6. Reações e Comentários.
7. Conexões e contagens.
8. Testes, acessibilidade e preparação do teste fechado.

## Estado atual

- [x] Escopo e linguagem do produto definidos.
- [x] Navegação do protótipo reduzida a Feed, Publicar e Perfil.
- [x] Login, cadastro, edição de Perfil e logout demonstráveis localmente.
- [ ] Autenticação e autorização no backend.
- [x] Estrutura de rotas compartilháveis e protegidas usando a sessão local temporária.
- [ ] Proteção de rotas conectada à autenticação do backend.
- [ ] Perfis e Publicações persistentes e multiusuário.
- [x] Criação local de Publicações com texto e até quatro imagens.
- [x] Feed e página individual lendo Publicações do armazenamento local.
- [x] Feed paginado, com estados de carregamento, erro, repetição e links compartilháveis.
- [ ] Reações, Comentários e Conexões persistentes.
- [x] Mensagens diretas persistidas no Appwrite com conversas privadas e leitura.
- [x] Central de notificações persistida no Appwrite e integrada às mensagens.
- [x] Pipeline local de formatação, lint, tipos, testes e build.
- [x] Testes automatizados das regras críticas e do fluxo de cadastro.
- [x] Workflow de CI e pre-commit preparados; ativação do hook aguarda repositório Git.

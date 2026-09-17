<div align="center">

# SMAP

### Plataforma colaborativa para registro, acompanhamento e resolução de problemas urbanos

[![Angular](https://img.shields.io/badge/Angular-22-DD0031?logo=angular&logoColor=white)](https://angular.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-F2A900)](#status-do-projeto)

[Protótipo no Figma](https://www.figma.com/design/qVf5ZaIikUQa5u1tiWZ2Xs/Projeto-final-Entra21?node-id=0-1)

</div>

## Sobre o projeto

O **SMAP** é uma aplicação web criada para facilitar a comunicação entre cidadãos e responsáveis pela manutenção urbana.

A plataforma permitirá registrar ocorrências como buracos, alagamentos, descarte irregular de lixo, problemas de iluminação e outras situações encontradas na cidade. Cada ocorrência poderá ser localizada no mapa, acompanhada pelo cidadão e administrada por meio de um painel próprio.

O principal diferencial do projeto é transformar uma denúncia em um processo transparente e acompanhável:

```text
Registro → Análise → Encaminhamento → Atendimento → Resolução
```

O projeto está sendo desenvolvido com **Angular 22** como projeto final do programa **Entra21**.

## Objetivo

Criar uma plataforma simples, acessível e colaborativa que permita:

- registrar problemas urbanos com localização e informações detalhadas;
- visualizar ocorrências em um mapa;
- acompanhar o andamento de cada solicitação;
- confirmar ocorrências registradas por outros cidadãos;
- organizar e atualizar os atendimentos em um painel administrativo;
- melhorar a transparência entre a comunidade e os responsáveis pela solução.

## Funcionalidades planejadas

### Área do cidadão

- cadastro e autenticação de usuários;
- mapa com as ocorrências registradas;
- pesquisa e filtros por categoria, distância, data e status;
- cadastro de ocorrência com categoria, localização, foto e descrição;
- consulta aos detalhes de uma ocorrência;
- confirmação de problemas já registrados;
- acompanhamento do histórico e do status;
- listagem das ocorrências criadas pelo usuário;
- perfil e notificações de atualização.

### Área administrativa

- painel com indicadores gerais;
- listagem e filtragem das ocorrências;
- definição de prioridade;
- alteração do status do atendimento;
- encaminhamento ao setor responsável;
- histórico de atualizações;
- moderação de conteúdos e denúncias falsas.

## Fluxo de uma ocorrência

| Etapa | Descrição |
|---|---|
| Recebida | A ocorrência foi enviada pelo cidadão |
| Em análise | As informações estão sendo verificadas |
| Encaminhada | A ocorrência foi direcionada ao setor responsável |
| Em atendimento | A solução está em andamento |
| Resolvida | O atendimento foi concluído |

## Categorias iniciais

- vias públicas;
- iluminação;
- lixo e limpeza urbana;
- alagamentos;
- sinalização;
- acessibilidade;
- áreas públicas;
- outros problemas urbanos.

## Tecnologias

### Implementadas atualmente

- [Angular 22](https://angular.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- HTML
- CSS
- RxJS
- Angular Router
- Angular Forms
- Vitest

### Integrações previstas

- API REST para gerenciamento dos dados;
- banco de dados para usuários e ocorrências;
- serviço de mapas e geolocalização;
- armazenamento das imagens;
- autenticação e controle de acesso.

As tecnologias do back-end e os serviços externos ainda serão definidos durante o desenvolvimento.

## Telas previstas

1. página inicial;
2. login;
3. cadastro;
4. mapa de ocorrências;
5. formulário de nova ocorrência;
6. detalhes da ocorrência;
7. minhas ocorrências;
8. acompanhamento do atendimento;
9. perfil do usuário;
10. dashboard administrativo;
11. gerenciamento de ocorrências;
12. detalhes administrativos da ocorrência.

Também serão criados estados de carregamento, erro, lista vazia, envio concluído e ausência de conexão.

## Protótipo

O planejamento visual e o fluxo inicial do projeto estão disponíveis no Figma:

[Visualizar o protótipo do SMAP](https://www.figma.com/design/qVf5ZaIikUQa5u1tiWZ2Xs/Projeto-final-Entra21?node-id=0-1)

## Como executar o projeto

### Pré-requisitos

Antes de começar, instale:

- [Node.js](https://nodejs.org/)
- npm
- [Git](https://git-scm.com/)

### Instalação

Clone o repositório:

```bash
git clone https://github.com/hericota/Smap.git
```

Entre na pasta do projeto:

```bash
cd Smap
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento:

```bash
npm start
```

A aplicação ficará disponível em:

```text
http://localhost:4200/
```

## Scripts disponíveis

| Comando | Função |
|---|---|
| `npm start` | Inicia o servidor de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run watch` | Compila e acompanha alterações |
| `npm test` | Executa os testes automatizados |

## Roadmap

### Etapa 1 — Estrutura e experiência

- [x] Criação do projeto em Angular
- [x] Protótipo inicial no Figma
- [ ] Definição do design system
- [ ] Criação dos componentes principais
- [ ] Configuração das rotas

### Etapa 2 — MVP do cidadão

- [ ] Cadastro e login
- [ ] Mapa de ocorrências
- [ ] Cadastro de ocorrência
- [ ] Listagem e detalhes
- [ ] Acompanhamento de status

### Etapa 3 — Administração

- [ ] Dashboard administrativo
- [ ] Gerenciamento das ocorrências
- [ ] Atualização de prioridade e status
- [ ] Histórico do atendimento

### Etapa 4 — Recursos avançados

- [ ] Confirmação comunitária
- [ ] Detecção de ocorrências próximas ou duplicadas
- [ ] Notificações
- [ ] Funcionamento como PWA
- [ ] Suporte ao uso offline
- [ ] Priorização automática de ocorrências

## Status do projeto

O SMAP está em **fase inicial de desenvolvimento**. A estrutura Angular já foi criada e as próximas etapas são concluir os fluxos do protótipo, organizar os componentes e implementar o MVP.

## Autor

Desenvolvido por [Henrique Galvão](https://github.com/hericota) durante o programa Entra21.

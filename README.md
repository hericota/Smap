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

## Funcionalidades e andamento

O frontend já contém páginas inicial, login, cadastro, perfil, mapa e registro de ocorrências. O formulário de registro seleciona um ponto no mapa ou utiliza a geolocalização do navegador, valida os dados e envia a ocorrência para a API. O mapa exibe as ocorrências recebidas da API. Também existem listagem de ocorrências registradas, confirmação após envio e páginas administrativas de dashboard, ocorrências, detalhes, mapa, regiões e configurações.

**Integrações em andamento:** os formulários de login e cadastro ainda não autenticam usuários na API. Parte das telas administrativas usa dados de interface e ainda precisa ser conectada ao backend. As rotas administrativas ainda não têm proteção por perfil. A API de ocorrências precisa estar disponível para cadastro e listagem funcionarem.

### Recursos em evolução

### Área do cidadão — visão planejada

- cadastro e autenticação de usuários;
- mapa com as ocorrências registradas;
- pesquisa e filtros por categoria, distância, data e status;
- cadastro de ocorrência com categoria, localização, foto e descrição;
- consulta aos detalhes de uma ocorrência;
- confirmação de problemas já registrados;
- acompanhamento do histórico e do status;
- listagem das ocorrências criadas pelo usuário;
- perfil e notificações de atualização.

### Área administrativa — visão planejada

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

### Integrações

- API REST de ocorrências: GET, POST e consulta por ID no frontend;
- Leaflet com tiles do OpenStreetMap e geolocalização do navegador;
- configuração da URL da API em `src/environments/environment.ts`;
Integrações previstas para próximas etapas: persistência de usuários, armazenamento de imagens, autenticação e controle de acesso.

O backend é um projeto separado. Consulte [API.md](API.md) para o contrato esperado pelo frontend e detalhes da configuração.

## Rotas disponíveis

| Rota | Página |
|---|---|
| `/home` | Início |
| `/login`, `/cadastro` | Acesso e cadastro |
| `/registrar-ocorrencia` | Formulário e mapa |
| `/confirmacao-ocorrencia/:id` | Confirmação do registro |
| `/ocorrenciasRegistrada`, `/ocorrencias`, `/mapa-separado` | Ocorrências e mapa |
| `/perfil-usuario`, `/perfil-config` | Perfil |
| `/admin/dashboard`, `/admin/ocorrencias`, `/admin/ocorrencias/:codigo` | Visão geral, listagem e detalhes administrativos |
| `/admin/mapa`, `/admin/regioes`, `/admin/configuracoes` | Outras páginas administrativas |

A rota `/` redireciona para `/home`.

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

Para carregar e cadastrar ocorrências, execute uma API compatível com [API.md](API.md). O endereço padrão é `http://localhost:8080`; se necessário, altere `apiUrl` em `src/environments/environment.ts`. A API deve permitir a origem `http://localhost:4200` por CORS. O mapa precisa de internet para carregar os tiles do OpenStreetMap; a localização automática depende da permissão do navegador.

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
- [x] Criação dos componentes principais
- [x] Configuração das rotas

### Etapa 2 — MVP do cidadão

- [ ] Cadastro e login
- [x] Mapa de ocorrências com integração de listagem
- [x] Formulário de cadastro de ocorrência integrado ao POST da API
- [ ] Listagem e detalhes
- [ ] Acompanhamento de status

### Etapa 3 — Administração

- [x] Interface do dashboard administrativo
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

O SMAP está **em desenvolvimento**. O frontend de registro e visualização de ocorrências já faz chamadas à API. Autenticação, proteção das rotas administrativas e integração completa dos fluxos administrativos ainda estão pendentes.

## Autor

Desenvolvido por Smap durante o programa Entra21.

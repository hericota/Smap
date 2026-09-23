# Conexão do mapa com a API

Edite `apiUrl` em `src/environments/environment.ts` com o endereço base do backend.
Exemplo: `https://api.exemplo.com` ou `https://api.exemplo.com/api`.
Não inclua `/ocorrencias`: o serviço acrescenta esse caminho. Reinicie `npm start`
ou gere um novo build após alterar a configuração.

O contrato abaixo mantém a rota e os campos usados pelo frontend. Ainda precisa
ser confirmado com o backend: o repositório informado da API não estava acessível.

- `GET <apiUrl>/ocorrencias`: retorna um array JSON de ocorrências.
- `POST <apiUrl>/ocorrencias`: recebe o JSON abaixo e retorna sucesso HTTP (2xx).
  O frontend não depende do corpo da resposta para abrir a confirmação.

```json
{
  "titulo": "Buraco na pista",
  "categoria": "Vias públicas",
  "descricao": "Buraco na esquina da rua",
  "localizacao": "Rua das Flores, 123",
  "latitude": -26.3,
  "longitude": -48.8,
  "criadaEm": "2026-09-23T12:00:00.000Z"
}
```

O identificador é gerado pelo backend, não pelo navegador. A listagem deve
acrescentar `id` aos campos acima. Ocorrências sem coordenadas válidas aparecem
na lista, mas não geram marcadores. Se a API usar outros campos, categorias em
enum ou paginação, adapte o contrato em `ConsumoApi` e na interface `Ocorrencia`.

O backend deve permitir a origem do frontend por CORS (por exemplo,
`http://localhost:4200` no desenvolvimento), incluindo GET, POST e Content-Type.
Um frontend HTTPS precisa de uma API HTTPS em produção.

O cadastro não lê nem apaga `smap.ocorrencias.v1`. Registros locais antigos não
são migrados automaticamente. Falhas de listagem não bloqueiam uma tentativa de
cadastro; falhas de envio preservam o formulário e o ponto selecionado. Sem API
rodando, as requisições exibem erro de conexão e não confirmam um salvamento.

## Validação

```sh
npm ci
npm run build
npm test -- --watch=false --include=src/app/pages/mapa/mapa.spec.ts --include=src/app/feats/posts/consumo-api.spec.ts
```

Os testes usam HTTP simulado e cobrem carregamento, coordenadas inválidas,
cache antigo/corrompido/bloqueado, envio duplicado, falha de POST com nova tentativa,
falha de GET e permissão de localização negada. Não acessam uma API real.

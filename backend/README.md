# CarameloFinder — Backend

API REST para cadastrar, consultar, atualizar e excluir relatos de animais perdidos ou encontrados.

## Tecnologias utilizadas

- Node.js
- Express
- SQLite
- better-sqlite3
- CORS

## Requisitos

- Node.js instalado
- npm instalado

## Como executar o projeto

1. Abra o terminal na pasta `backend`.
2. Instale as dependencias:

   ```bash
   npm install
   ```

3. Inicie o servidor:

   ```bash
   npm start
   ```

4. A API estara disponivel em:

   `http://localhost:3000`



## Banco de dados

O projeto utiliza SQLite.

O arquivo caramelofinder.db é criado automaticamente quando o servidor é iniciado. A tabela reports é criada a partir do arquivo sql/schema.sql, caso ainda não exista.

Cada integrante terá seu próprio banco de dados local.

## Dados de teste

O arquivo sql/seed.sql contém dados de exemplo para testar a API.

A inserção desses dados é opcional. Execute o script apenas uma vez em cada banco de dados para evitar registros duplicados.

Para inserir os dados, execute o seguinte comando no terminal, dentro da pasta backend:

node -e "const db = require('./src/config/db'); const fs = require('fs'); db.exec(fs.readFileSync('./sql/seed.sql', 'utf8')); console.log('Dados de teste inseridos!');"


## Endpoints da API

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/` | Verificar se a API esta funcionando |
| GET | `/api/reports` | Listar todos os relatos |
| GET | `/api/reports/:id` | Consultar um relato pelo ID |
| POST | `/api/reports` | Cadastrar um novo relato |
| PUT | `/api/reports/:id` | Atualizar um relato |
| DELETE | `/api/reports/:id` | Excluir um relato |

## Campos de um relato

| Campo | Tipo | Obrigatorio |
|---|---|---|
| `animal_name` | Texto | Sim |
| `animal_type` | Texto | Sim (`lost` ou `found`) |
| `description` | Texto | Nao |
| `location` | Texto | Sim |
| `report_date` | Data em texto (`YYYY-MM-DD`) | Sim |
| `contact_name` | Texto | Sim |
| `contact_phone` | Texto | Sim |
| `image_url` | Texto | Nao |
| `status` | Texto | Nao na criacao; na atualizacao aceita `active` ou `resolved` |

## Exemplo: cadastrar um relato

Envie uma requisição `POST` para `/api/reports` com o seguinte JSON:

```json
{
  "animal_name": "Rex",
  "animal_type": "lost",
  "description": "Cachorro de porte medio, cor marrom.",
  "location": "Cachoeirinha, RS",
  "report_date": "2026-10-27",
  "contact_name": "Maria Silva",
  "contact_phone": "51999990000",
  "image_url": ""
}
```

## Respostas e erros

- `200`: requisicao concluída com sucesso.
- `201`: relato cadastrado com sucesso.
- `400`: dados invalidos ou ID inválido.
- `404`: relato não encontrado.

As respostas de erro sao retornadas em JSON.

## Observacoes

- Os relatos sao ordenados pelo ID, do mais recente para o mais antigo.
- O campo `animal_type` aceita `lost` ou `found`.
- O campo `status` utiliza `active` ou `resolved`.
- A atualizacao com `PUT` exige os campos obrigatorios do relato.
- A API utiliza CORS para permitir requisicoes do frontend durante o desenvolvimento.

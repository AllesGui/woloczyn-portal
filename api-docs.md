# Documentação da API

## Autenticação

### POST `/api/auth/login`
**Body:**
```json
{
  "email": "admin@woloczyn.com.br",
  "password": "admin123"
}
```

## Atendimentos

### POST `/api/atendimentos`
Webhook para o n8n enviar a triagem. Requer Header: `x-api-key: CHAVE_SUPER_SECRETA`

**Body:**
```json
{
  "nome": "João Silva",
  "telefone": "55999999999",
  "area_juridica": "Trabalhista",
  "prioridade": "Alta",
  "resumo": "Cliente deseja processar ex-empregador por horas extras."
}
```

### GET `/api/atendimentos?status=pendente`
Requer Header: `Authorization: Bearer <token>`
Retorna a lista de atendimentos pendentes ordenada por prioridade e data.

### GET `/api/atendimentos?status=atendido`
Requer Header: `Authorization: Bearer <token>`
Retorna a lista de atendimentos finalizados.

### PUT `/api/atendimentos/:id/finalizar`
Requer Header: `Authorization: Bearer <token>`
Marca um atendimento como resolvido.

**Resposta de Sucesso (200 OK):**
```json
{
  "id": "uuid",
  "status": "atendido",
  "data_finalizacao": "2024-03-10T15:00:00.000Z",
  "usuario_responsavel": "uuid"
}
```

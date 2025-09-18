# Integração Frontend-Backend - Sistema AWAY

## 🚀 Configuração Realizada

O frontend já está configurado para se integrar com o backend. Aqui estão as principais mudanças implementadas:

### 1. Configuração de Ambiente
- ✅ Criados arquivos de ambiente (`src/environments/`)
- ✅ URLs do backend centralizadas
- ✅ Configurações de token padronizadas

### 2. Serviços Atualizados
- ✅ `AuthService` - Autenticação com backend real
- ✅ `AssistidoService` - CRUD de assistidos
- ✅ `ComparecimentoService` - CRUD de comparecimentos
- ✅ `ApiConfigService` - Configurações centralizadas

### 3. Interceptor de Autenticação
- ✅ Adiciona automaticamente token Bearer nas requisições
- ✅ Usa configurações do environment

### 4. Mapeamento de Dados
- ✅ `MapperService` já configurado para converter dados entre frontend/backend

## 🔧 Como Usar

### Configurar URL do Backend

1. **Para desenvolvimento local:**
   ```typescript
   // src/environments/environment.ts
   export const environment = {
     apiUrl: 'http://localhost:8080', // Ajuste a porta se necessário
   };
   ```

2. **Para produção:**
   ```typescript
   // src/environments/environment.prod.ts
   export const environment = {
     apiUrl: 'https://sua-api-producao.com',
   };
   ```

### Executar com Proxy (Recomendado para desenvolvimento)

```bash
# Com proxy (evita problemas de CORS)
npm run start:proxy

# Sem proxy (normal)
npm start
```

### Endpoints Esperados pelo Frontend

O frontend espera que o backend tenha os seguintes endpoints:

#### Autenticação
- `POST /auth/login` - Login do usuário
- Retorno esperado:
  ```json
  {
    "token": "jwt-token-aqui",
    "usuario": { ... },
    "expiresIn": 3600
  }
  ```

#### Assistidos
- `GET /assistido/findAll` - Listar todos
- `GET /assistido/findById/{id}` - Buscar por ID
- `GET /assistido/numProcesso?numProcesso={numero}` - Buscar por processo
- `POST /assistido/save` - Criar novo
- `PUT /assistido/update/{id}` - Atualizar
- `DELETE /assistido/delete/{id}` - Excluir

#### Comparecimentos
- `GET /comparecimento/findAll` - Listar todos
- `GET /comparecimento/findById/{id}` - Buscar por ID
- `POST /comparecimento/save` - Criar novo
- `PUT /comparecimento/update/{id}` - Atualizar
- `DELETE /comparecimento/delete/{id}` - Excluir

## 🔒 Autenticação

### Formato do Token
- Tipo: Bearer Token
- Header: `Authorization: Bearer {token}`
- Storage: localStorage (chaves configuráveis)

### Fluxo de Autenticação
1. Login via `POST /auth/login`
2. Token salvo automaticamente
3. Interceptor adiciona token em todas as requisições
4. Logout limpa token e dados do usuário

## 🛠️ Personalização

### Alterar Endpoints
Edite o arquivo `src/app/config/api-endpoints.ts` para ajustar os endpoints conforme seu backend.

### Alterar Formato dos Dados
O `MapperService` converte dados entre frontend e backend. Ajuste os métodos conforme necessário.

### Alterar Configurações de Auth
Edite as configurações em `src/environments/environment.ts`:

```typescript
auth: {
  tokenPrefix: 'Bearer ', // ou 'JWT ' ou outro
  tokenStorageKey: 'token',
  userStorageKey: 'user'
}
```

## 🧪 Teste da Integração

### 1. Verificar se Backend está Rodando
```bash
curl http://localhost:8080/auth/login
```

### 2. Testar Login
1. Inicie o frontend: `npm run start:proxy`
2. Acesse: `http://localhost:4200`
3. Tente fazer login
4. Verifique no Network tab do browser se as requisições estão sendo enviadas

### 3. Logs de Debug
- Abra o DevTools do browser
- Na aba Network, veja as requisições HTTP
- Na aba Console, veja logs de erros

## 🚨 Problemas Comuns

### CORS Error
**Solução:** Use `npm run start:proxy` em vez de `npm start`

### 401 Unauthorized
**Verificar:**
- Token está sendo enviado corretamente?
- Formato do token está correto? (Bearer vs JWT)
- Backend está validando o token?

### 404 Not Found
**Verificar:**
- URLs dos endpoints estão corretas?
- Backend está rodando na porta certa?
- Endpoints existem no backend?

### Dados não aparecem
**Verificar:**
- Estrutura de dados do backend bate com o `MapperService`?
- Campos obrigatórios estão presentes?

## 📞 Próximos Passos

1. **Configure a URL do seu backend** nos arquivos de environment
2. **Teste a conexão** fazendo login
3. **Ajuste os endpoints** se necessário no arquivo de configuração
4. **Customize o mapeamento** de dados se a estrutura do backend for diferente

---

*Configuração realizada em: ${new Date().toLocaleDateString('pt-BR')}*

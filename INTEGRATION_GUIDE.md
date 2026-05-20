# Integração Backend e Frontend - VIGIA

## 📋 Resumo da Integração

Este documento descreve a integração completa entre o Backend (ASP.NET Core) e o Frontend (React + Vite) do projeto VIGIA.

### ✅ O que foi integrado:

1. **Autenticação de Login** - LoginCli.tsx conectado ao endpoint `/api/auth/login`
2. **Cadastro de Usuários** - CadastroClientes.tsx conectado ao endpoint `/api/auth/register`
3. **Gerenciamento de Tokens** - Sistema de autenticação com armazenamento seguro
4. **CORS** - Configurado no backend para aceitar requisições do frontend
5. **API Proxy** - Configurado no Vite para desenvolvimento local
6. **Utilitários de Autenticação** - Sistema centralizado de gerenciamento de dados de autenticação

---

## 🚀 Como Executar

### Backend (ASP.NET Core)

```bash
cd BackEnd
dotnet restore
dotnet run
```

O backend rodará em: `https://localhost:5000` (HTTPS) ou `http://localhost:5000` (HTTP)

**Certifique-se de que:**
- Banco de dados PostgreSQL está configurado em `appsettings.json`
- A connection string está correta: `DefaultConnection`

### Frontend (React + Vite)

```bash
cd FrontEnd
npm install  # ou 'bun install' se usar Bun
npm run dev
```

O frontend rodará em: `http://localhost:8080`

---

## 🔧 Configuração da API

### Variáveis de Ambiente (Frontend)

Crie um arquivo `.env.local` na pasta FrontEnd:

```
VITE_API_URL=http://localhost:5000/api
```

Ou use o arquivo `.env.example` fornecido como referência.

### CORS (Backend)

O backend foi configurado para aceitar requisições de:
- `http://localhost:8080`
- `http://localhost:5173`
- `http://127.0.0.1:8080`
- `http://127.0.0.1:5173`

Para adicionar mais origens, edite o `Program.cs`:

```csharp
options.AddPolicy("AllowFrontend", policy =>
{
    policy.WithOrigins(
            "http://seu-dominio.com",  // Adicione seu domínio aqui
            "https://seu-dominio.com"
        )
        .AllowAnyMethod()
        .AllowAnyHeader()
        .AllowCredentials();
});
```

---

## 📡 Endpoints da API

### Autenticação

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "senha": "senha123"
}
```

**Resposta (201 Created):**
```json
{
  "accessToken": "jwt-token-here",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "cliente": {
    "id": "uuid",
    "nomeCompleto": "Nome do Usuário",
    "email": "usuario@email.com",
    "prioridade": "Normal"
  }
}
```

#### Registro
```http
POST /api/auth/register
Content-Type: application/json

{
  "nomeCompleto": "Nome Completo",
  "idade": 65,
  "cpf": "123.456.789-00",
  "rg": "12.345.678-9",
  "email": "usuario@email.com",
  "telefone": "(14) 99999-9999",
  "enderecoCompleto": "Rua Principal, 123",
  "contatoEmergenciaNome": "Contato",
  "contatoEmergenciaTelefone": "(14) 99999-8888",
  "mobilidade": {
    "condicaoMobilidade": "deambula",
    "tipoSanguineo": "A+",
    "necessitaAcompanhante": false,
    "transporteExclusivoEmMaca": false,
    "usoContínuoDeOxigenio": false,
    "pacienteBeriatrico": false
  },
  "dadosClinicos": {
    "cartaoSus": "123456789012345",
    "alergias": "Penicilina",
    "medicamentosUsoContinuo": "Medicamento X",
    "comorbidades": "Hipertensão",
    "tratamentoOncologico": false,
    "quimioterapiaOuRadioterapia": false,
    "doencaPulmonarCronicaDpoc": false,
    "posOperatorioRecente": false,
    "hemodialise": false,
    "cardiopatiaGrave": false,
    "gestacaoAltoRisco": false,
    "cuidadosPaliativos": false
  },
  "senha": "Senha123!",
  "confirmarSenha": "Senha123!",
  "aceitouTermos": true
}
```

**Resposta (201 Created):**
```json
{
  "accessToken": "jwt-token-here",
  "tokenType": "Bearer",
  "expiresIn": 3600,
  "cliente": {
    "id": "uuid",
    "nomeCompleto": "Nome Completo",
    "email": "usuario@email.com",
    "prioridade": "Normal"
  }
}
```

---

## 🔐 Gerenciamento de Autenticação

### Serviço de Autenticação (`src/services/auth.ts`)

Funções disponíveis:

```typescript
// Login
login(data: LoginRequest): Promise<AuthResponse>

// Registro
register(data: RegisterRequest): Promise<AuthResponse>

// Logout
logout(): void

// Obter token
getAuthToken(): string | null

// Verificar se token é válido
isTokenValid(): boolean
```

### Utilitários (`src/lib/authUtils.ts`)

```typescript
// Salvar token
saveAuthToken(token: string, expiresIn: number): void

// Salvar dados do cliente
saveClientData(clientData: StoredClientData): void

// Obter dados do cliente
getClientData(): StoredClientData | null

// Limpar dados de autenticação
clearAuthData(): void

// Obter headers de autorização
getAuthHeaders(): Record<string, string>

// Verificar se está autenticado
isAuthenticated(): boolean
```

---

## 📁 Estrutura de Pastas

```
FrontEnd/
├── src/
│   ├── services/
│   │   └── auth.ts           # Serviço de autenticação
│   ├── lib/
│   │   └── authUtils.ts      # Utilitários de autenticação
│   ├── pages/
│   │   ├── LoginCli.tsx      # Página de login
│   │   └── CadastroClientes.tsx # Página de registro
│   └── ...
├── .env.example              # Exemplo de variáveis de ambiente
├── .env.local                # Variáveis de ambiente locais
└── vite.config.ts            # Configuração com proxy da API

BackEnd/
├── Controllers/
│   └── AuthController.cs     # Endpoints de autenticação
├── Services/
│   └── AuthService.cs        # Lógica de autenticação
├── DTOs/
│   └── Auth/
│       ├── LoginRequestDTO.cs
│       └── RegisterRequestDTO.cs
├── Program.cs                # Configuração de CORS
└── ...
```

---

## 🧪 Testando a Integração

### 1. Teste de Login

1. Abra `http://localhost:8080`
2. Clique em "Bem-vindo!"
3. Preencha com:
   - Email: `teste@email.com`
   - Senha: `senha123`
4. Clique em "Entrar no Portal"
5. Verificar se redireciona para `/portal`

### 2. Teste de Registro

1. Abra `http://localhost:8080`
2. Clique em "Primeira vez aqui? Cadastre-se"
3. Preencha todos os dados obrigatórios
4. Clique em "Criar Conta"
5. Verificar se redireciona para `/portal`

### 3. Teste com DevTools

Abra o Console do navegador (F12):

```javascript
// Verificar token
localStorage.getItem('authToken')

// Verificar dados do cliente
localStorage.getItem('clientData')

// Fazer logout
localStorage.removeItem('authToken')
localStorage.removeItem('tokenExpiry')
localStorage.removeItem('clientData')
```

---

## ⚠️ Problemas Comuns

### 1. "CORS error"
**Solução:** Verifique se o backend está rodando e se a URL está configurada corretamente no `.env.local`

### 2. "Invalid request"
**Solução:** Verifique se todos os campos obrigatórios estão sendo enviados

### 3. "401 Unauthorized"
**Solução:** O token expirou. Faça logout e login novamente

### 4. Frontend não consegue conectar ao backend
**Solução:** 
- Verifique se o backend está rodando: `http://localhost:5000`
- Verifique a configuração de CORS no `Program.cs`
- Use o proxy do Vite durante desenvolvimento

---

## 🔄 Próximos Passos

- [ ] Implementar refresh token
- [ ] Adicionar validação de senha forte
- [ ] Implementar recuperação de senha
- [ ] Adicionar autenticação com 2FA
- [ ] Implementar roles e permissões (Citizen, Manager)
- [ ] Adicionar logs de autenticação
- [ ] Implementar rate limiting

---

## 📚 Referências

- [ASP.NET Core CORS Documentation](https://docs.microsoft.com/en-us/aspnet/core/security/cors)
- [Vite Server Proxy](https://vitejs.dev/config/server-options.html#server-proxy)
- [React Router v6](https://reactrouter.com/)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

**Última atualização:** Maio 2026
**Versão:** 1.0

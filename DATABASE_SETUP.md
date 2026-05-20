# 🗄️ Setup do Banco de Dados PostgreSQL

## Pré-requisitos

- PostgreSQL instalado e rodando
- `psql` (cliente PostgreSQL) disponível no PATH

## ⚙️ Configuração

### 1. Verificar credenciais no Backend

Abra `BackEnd/appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Database=vigia_db;Username=postgres;Password=postgres"
  }
}
```

**Certifique-se de que:**
- `Username`: `postgres` (ou seu usuário do PostgreSQL)
- `Password`: a senha que você definiu no PostgreSQL
- `Host`: `localhost`
- `Database`: `vigia_db`

### 2. Opção A: Criar banco com script SQL

**Windows (PowerShell):**

```powershell
# Conectar ao PostgreSQL como superuser
psql -U postgres -h localhost

# No psql, execute:
```

Copie todo o conteúdo de `create-database.sql` e execute no psql:

```sql
-- (colar todo o conteúdo do arquivo create-database.sql)
```

Depois saia:
```sql
\q
```

**Linux/Mac (Terminal):**

```bash
psql -U postgres -h localhost < create-database.sql
```

### 3. Opção B: Usar Entity Framework Core (Migrations)

**No Terminal (dentro da pasta BackEnd):**

```bash
# Criar migration (se ainda não existir)
dotnet ef migrations add InitialCreate

# Aplicar migration ao banco de dados
dotnet ef database update
```

> Se receber erro "vigia_db" não existe, use a Opção A primeiro.

## ✅ Verificar Conexão

**No psql:**

```sql
\c vigia_db   -- conectar ao banco
\dt           -- listar tabelas
\d "Clientes" -- ver estrutura da tabela Clientes
```

Você deve ver as tabelas:
- Clientes
- MobilidadeNecessidades
- DadosClinicos

## 🚀 Próximos passos

Após criar o banco com sucesso:

1. Volte ao BackEnd
2. Execute `dotnet run`
3. Teste o cadastro e login

## ⚠️ Troubleshooting

### "FATAL: Ident authentication failed for user 'postgres'"
- Edite `PostgreSQL/data/pg_hba.conf` e mude `ident` para `md5`
- Reinicie o PostgreSQL

### "role 'postgres' does not exist"
- Use seu usuário do PostgreSQL: `psql -U seu_usuario`

### "Database 'vigia_db' does not exist"
- Execute o script `create-database.sql` primeiro

### "Connection refused"
- Verifique se PostgreSQL está rodando
- Windows: Services → PostgreSQL
- Linux: `sudo systemctl status postgresql`

## 📝 Notas

- O banco usa UTF-8 encoding
- Senhas são hasheadas com BCrypt
- CPF e Email são UNIQUE (não podem repetir)
- Dados clínicos são relacionados com Cliente via Foreign Key

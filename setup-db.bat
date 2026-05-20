@echo off
REM Script PowerShell para criar banco de dados PostgreSQL para VIGIA
REM Execute como Administrator

echo.
echo =====================================
echo 🗄️  Setup do Banco de Dados VIGIA
echo =====================================
echo.

REM Verificar se PostgreSQL está instalado
where psql >nul 2>nul
if %errorlevel% neq 0 (
    echo ❌ PostgreSQL não foi encontrado no PATH
    echo.
    echo Soluções:
    echo 1. Instale PostgreSQL de https://www.postgresql.org/download/windows/
    echo 2. Ou adicione o caminho do PostgreSQL ao PATH:
    echo    C:\Program Files\PostgreSQL\XX\bin (XX = versão)
    echo.
    pause
    exit /b 1
)

echo ✓ PostgreSQL encontrado
echo.
echo Criando banco de dados 'vigia_db'...
echo.

REM Criar banco de dados
set PGPASSWORD=postgres
psql -h localhost -U postgres -c "DROP DATABASE IF EXISTS vigia_db;" 2>nul
psql -h localhost -U postgres -c "CREATE DATABASE vigia_db WITH ENCODING 'UTF8';" 

if %errorlevel% neq 0 (
    echo.
    echo ❌ Erro ao criar banco de dados
    echo.
    echo Possíveis soluções:
    echo 1. Verifique se PostgreSQL está rodando
    echo 2. Verifique a senha do usuário postgres (padrão: postgres)
    echo 3. Abra Services (services.msc) e inicie o PostgreSQL
    echo.
    pause
    exit /b 1
)

echo ✓ Banco de dados criado!
echo.
echo Criando tabelas...
echo.

REM Criar tabelas
psql -h localhost -U postgres -d vigia_db -c ^
"CREATE TABLE IF NOT EXISTS ""Clientes"" ( ^
    ""Id"" uuid NOT NULL PRIMARY KEY, ^
    ""NomeCompleto"" varchar(500) NOT NULL, ^
    ""Idade"" integer NOT NULL, ^
    ""Cpf"" varchar(20) NOT NULL UNIQUE, ^
    ""Rg"" varchar(20) NOT NULL, ^
    ""Email"" varchar(255) NOT NULL UNIQUE, ^
    ""Telefone"" varchar(20) NOT NULL, ^
    ""EnderecoCompleto"" text NOT NULL, ^
    ""ContatoEmergenciaNome"" varchar(255), ^
    ""ContatoEmergenciaTelefone"" varchar(20), ^
    ""SenhaHash"" text NOT NULL, ^
    ""Prioridade"" integer NOT NULL, ^
    ""CriadoEm"" timestamp NOT NULL ^
);"

psql -h localhost -U postgres -d vigia_db -c ^
"CREATE TABLE IF NOT EXISTS ""MobilidadeNecessidades"" ( ^
    ""Id"" uuid NOT NULL PRIMARY KEY, ^
    ""CondicaoMobilidade"" varchar(255), ^
    ""TipoSanguineo"" varchar(10), ^
    ""NecessitaAcompanhante"" boolean NOT NULL, ^
    ""TransporteExclusivoEmMaca"" boolean NOT NULL, ^
    ""UsoContínuoDeOxigenio"" boolean NOT NULL, ^
    ""PacienteBeriatrico"" boolean NOT NULL, ^
    ""ClienteId"" uuid NOT NULL, ^
    CONSTRAINT ""FK_MobilidadeNecessidades_Clientes"" FOREIGN KEY (""ClienteId"") REFERENCES ""Clientes"" (""Id"") ON DELETE CASCADE ^
);"

psql -h localhost -U postgres -d vigia_db -c ^
"CREATE TABLE IF NOT EXISTS ""DadosClinicos"" ( ^
    ""Id"" uuid NOT NULL PRIMARY KEY, ^
    ""CartaoSus"" varchar(255), ^
    ""Alergias"" text, ^
    ""MedicamentosUsoContinuo"" text, ^
    ""Comorbidades"" text, ^
    ""TratamentoOncologico"" boolean NOT NULL, ^
    ""QuimioterapiaOuRadioterapia"" boolean NOT NULL, ^
    ""DoencaPulmonarCronicaDpoc"" boolean NOT NULL, ^
    ""PosOperatorioRecente"" boolean NOT NULL, ^
    ""Hemodialise"" boolean NOT NULL, ^
    ""CardiopatiaGrave"" boolean NOT NULL, ^
    ""GestacaoAltoRisco"" boolean NOT NULL, ^
    ""CuidadosPaliativos"" boolean NOT NULL, ^
    ""ClienteId"" uuid NOT NULL, ^
    CONSTRAINT ""FK_DadosClinicos_Clientes"" FOREIGN KEY (""ClienteId"") REFERENCES ""Clientes"" (""Id"") ON DELETE CASCADE ^
);"

psql -h localhost -U postgres -d vigia_db -c "CREATE INDEX IF NOT EXISTS ""IX_DadosClinicos_ClienteId"" ON ""DadosClinicos"" (""ClienteId"");"
psql -h localhost -U postgres -d vigia_db -c "CREATE INDEX IF NOT EXISTS ""IX_MobilidadeNecessidades_ClienteId"" ON ""MobilidadeNecessidades"" (""ClienteId"");"
psql -h localhost -U postgres -d vigia_db -c "CREATE INDEX IF NOT EXISTS ""IX_Clientes_Email"" ON ""Clientes"" (""Email"");"
psql -h localhost -U postgres -d vigia_db -c "CREATE INDEX IF NOT EXISTS ""IX_Clientes_Cpf"" ON ""Clientes"" (""Cpf"");"

if %errorlevel% neq 0 (
    echo.
    echo ⚠️  Algumas tabelas podem já existir (tudo bem!)
    echo.
) else (
    echo ✓ Tabelas criadas!
)

echo.
echo =====================================
echo ✅ Banco de dados está pronto!
echo =====================================
echo.
echo Próximos passos:
echo 1. Abra um terminal na pasta BackEnd
echo 2. Execute: dotnet run
echo 3. Em outro terminal, vá para FrontEnd
echo 4. Execute: npm run dev
echo 5. Acesse: http://localhost:8080
echo.
pause

#!/bin/bash
# Script para criar banco de dados PostgreSQL para VIGIA
# Use: ./setup-db.sh

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
NC='\033[0m' # No Color

echo "🗄️  Criando banco de dados PostgreSQL para VIGIA..."

# Tente conectar como postgres
PGPASSWORD=postgres psql -h localhost -U postgres -c "CREATE DATABASE vigia_db WITH ENCODING = 'UTF8';" 2>/dev/null

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Banco de dados criado com sucesso!${NC}"
else
    echo -e "${RED}✗ Erro ao criar banco. Verifique se PostgreSQL está rodando.${NC}"
    exit 1
fi

# Criar tabelas usando o script SQL
PGPASSWORD=postgres psql -h localhost -U postgres -d vigia_db -f - << 'SQL'
CREATE TABLE IF NOT EXISTS "Clientes" (
    "Id" uuid NOT NULL PRIMARY KEY,
    "NomeCompleto" varchar(500) NOT NULL,
    "Idade" integer NOT NULL,
    "Cpf" varchar(20) NOT NULL UNIQUE,
    "Rg" varchar(20) NOT NULL,
    "Email" varchar(255) NOT NULL UNIQUE,
    "Telefone" varchar(20) NOT NULL,
    "EnderecoCompleto" text NOT NULL,
    "ContatoEmergenciaNome" varchar(255),
    "ContatoEmergenciaTelefone" varchar(20),
    "SenhaHash" text NOT NULL,
    "Prioridade" integer NOT NULL,
    "CriadoEm" timestamp NOT NULL
);

CREATE TABLE IF NOT EXISTS "MobilidadeNecessidades" (
    "Id" uuid NOT NULL PRIMARY KEY,
    "CondicaoMobilidade" varchar(255),
    "TipoSanguineo" varchar(10),
    "NecessitaAcompanhante" boolean NOT NULL,
    "TransporteExclusivoEmMaca" boolean NOT NULL,
    "UsoContínuoDeOxigenio" boolean NOT NULL,
    "PacienteBeriatrico" boolean NOT NULL,
    "ClienteId" uuid NOT NULL,
    CONSTRAINT "FK_MobilidadeNecessidades_Clientes" FOREIGN KEY ("ClienteId") REFERENCES "Clientes" ("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "DadosClinicos" (
    "Id" uuid NOT NULL PRIMARY KEY,
    "CartaoSus" varchar(255),
    "Alergias" text,
    "MedicamentosUsoContinuo" text,
    "Comorbidades" text,
    "TratamentoOncologico" boolean NOT NULL,
    "QuimioterapiaOuRadioterapia" boolean NOT NULL,
    "DoencaPulmonarCronicaDpoc" boolean NOT NULL,
    "PosOperatorioRecente" boolean NOT NULL,
    "Hemodialise" boolean NOT NULL,
    "CardiopatiaGrave" boolean NOT NULL,
    "GestacaoAltoRisco" boolean NOT NULL,
    "CuidadosPaliativos" boolean NOT NULL,
    "ClienteId" uuid NOT NULL,
    CONSTRAINT "FK_DadosClinicos_Clientes" FOREIGN KEY ("ClienteId") REFERENCES "Clientes" ("Id") ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS "IX_DadosClinicos_ClienteId" ON "DadosClinicos" ("ClienteId");
CREATE INDEX IF NOT EXISTS "IX_MobilidadeNecessidades_ClienteId" ON "MobilidadeNecessidades" ("ClienteId");
CREATE INDEX IF NOT EXISTS "IX_Clientes_Email" ON "Clientes" ("Email");
CREATE INDEX IF NOT EXISTS "IX_Clientes_Cpf" ON "Clientes" ("Cpf");
SQL

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Tabelas criadas com sucesso!${NC}"
    echo -e "${GREEN}✓ Banco de dados está pronto para uso!${NC}"
else
    echo -e "${RED}✗ Erro ao criar tabelas${NC}"
    exit 1
fi

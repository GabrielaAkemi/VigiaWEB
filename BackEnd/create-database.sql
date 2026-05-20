-- Script para criar o banco de dados e tabelas do VIGIA
-- Execute com PostgreSQL

-- Criar banco de dados
CREATE DATABASE vigia_db
  WITH 
  ENCODING = 'UTF8'
  LC_COLLATE = 'en_US.UTF-8'
  LC_CTYPE = 'en_US.UTF-8';

-- Conectar ao banco
\c vigia_db;

-- Criar tabelas
CREATE TABLE IF NOT EXISTS "Clientes" (
    "Id" uuid NOT NULL,
    "NomeCompleto" character varying(500) NOT NULL,
    "Idade" integer NOT NULL,
    "Cpf" character varying(20) NOT NULL UNIQUE,
    "Rg" character varying(20) NOT NULL,
    "Email" character varying(255) NOT NULL UNIQUE,
    "Telefone" character varying(20) NOT NULL,
    "EnderecoCompleto" text NOT NULL,
    "ContatoEmergenciaNome" character varying(255),
    "ContatoEmergenciaTelefone" character varying(20),
    "SenhaHash" text NOT NULL,
    "Prioridade" integer NOT NULL,
    "CriadoEm" timestamp with time zone NOT NULL,
    CONSTRAINT "PK_Clientes" PRIMARY KEY ("Id")
);

CREATE TABLE IF NOT EXISTS "MobilidadeNecessidades" (
    "Id" uuid NOT NULL,
    "CondicaoMobilidade" character varying(255),
    "TipoSanguineo" character varying(10),
    "NecessitaAcompanhante" boolean NOT NULL,
    "TransporteExclusivoEmMaca" boolean NOT NULL,
    "UsoContínuoDeOxigenio" boolean NOT NULL,
    "PacienteBeriatrico" boolean NOT NULL,
    "ClienteId" uuid NOT NULL,
    CONSTRAINT "PK_MobilidadeNecessidades" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_MobilidadeNecessidades_Clientes_ClienteId" FOREIGN KEY ("ClienteId") REFERENCES "Clientes" ("Id") ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS "DadosClinicos" (
    "Id" uuid NOT NULL,
    "CartaoSus" character varying(255),
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
    CONSTRAINT "PK_DadosClinicos" PRIMARY KEY ("Id"),
    CONSTRAINT "FK_DadosClinicos_Clientes_ClienteId" FOREIGN KEY ("ClienteId") REFERENCES "Clientes" ("Id") ON DELETE CASCADE
);

-- Criar índices
CREATE INDEX "IX_DadosClinicos_ClienteId" ON "DadosClinicos" ("ClienteId");
CREATE INDEX "IX_MobilidadeNecessidades_ClienteId" ON "MobilidadeNecessidades" ("ClienteId");
CREATE INDEX "IX_Clientes_Email" ON "Clientes" ("Email");
CREATE INDEX "IX_Clientes_Cpf" ON "Clientes" ("Cpf");

-- Mostrar resultado
\d

SELECT 'Banco de dados criado com sucesso!' AS status;

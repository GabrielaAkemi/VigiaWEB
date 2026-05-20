using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vigia.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Clientes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    NomeCompleto = table.Column<string>(type: "TEXT", nullable: false),
                    Idade = table.Column<int>(type: "INTEGER", nullable: false),
                    Cpf = table.Column<string>(type: "TEXT", nullable: false),
                    Rg = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Telefone = table.Column<string>(type: "TEXT", nullable: false),
                    EnderecoCompleto = table.Column<string>(type: "TEXT", nullable: false),
                    ContatoEmergenciaNome = table.Column<string>(type: "TEXT", nullable: true),
                    ContatoEmergenciaTelefone = table.Column<string>(type: "TEXT", nullable: true),
                    SenhaHash = table.Column<string>(type: "TEXT", nullable: false),
                    Prioridade = table.Column<int>(type: "INTEGER", nullable: false),
                    CriadoEm = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Clientes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "DadosClinicos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    CartaoSus = table.Column<string>(type: "TEXT", nullable: true),
                    Alergias = table.Column<string>(type: "TEXT", nullable: true),
                    MedicamentosUsoContinuo = table.Column<string>(type: "TEXT", nullable: true),
                    Comorbidades = table.Column<string>(type: "TEXT", nullable: true),
                    TratamentoOncologico = table.Column<bool>(type: "INTEGER", nullable: false),
                    QuimioterapiaOuRadioterapia = table.Column<bool>(type: "INTEGER", nullable: false),
                    DoencaPulmonarCronicaDpoc = table.Column<bool>(type: "INTEGER", nullable: false),
                    PosOperatorioRecente = table.Column<bool>(type: "INTEGER", nullable: false),
                    Hemodialise = table.Column<bool>(type: "INTEGER", nullable: false),
                    CardiopatiaGrave = table.Column<bool>(type: "INTEGER", nullable: false),
                    GestacaoAltoRisco = table.Column<bool>(type: "INTEGER", nullable: false),
                    CuidadosPaliativos = table.Column<bool>(type: "INTEGER", nullable: false),
                    ClienteId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DadosClinicos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DadosClinicos_Clientes_ClienteId",
                        column: x => x.ClienteId,
                        principalTable: "Clientes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "MobilidadeNecessidades",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    CondicaoMobilidade = table.Column<string>(type: "TEXT", nullable: true),
                    TipoSanguineo = table.Column<string>(type: "TEXT", nullable: true),
                    NecessitaAcompanhante = table.Column<bool>(type: "INTEGER", nullable: false),
                    TransporteExclusivoEmMaca = table.Column<bool>(type: "INTEGER", nullable: false),
                    UsoContínuoDeOxigenio = table.Column<bool>(type: "INTEGER", nullable: false),
                    PacienteBeriatrico = table.Column<bool>(type: "INTEGER", nullable: false),
                    ClienteId = table.Column<Guid>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_MobilidadeNecessidades", x => x.Id);
                    table.ForeignKey(
                        name: "FK_MobilidadeNecessidades_Clientes_ClienteId",
                        column: x => x.ClienteId,
                        principalTable: "Clientes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DadosClinicos_ClienteId",
                table: "DadosClinicos",
                column: "ClienteId",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_MobilidadeNecessidades_ClienteId",
                table: "MobilidadeNecessidades",
                column: "ClienteId",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DadosClinicos");

            migrationBuilder.DropTable(
                name: "MobilidadeNecessidades");

            migrationBuilder.DropTable(
                name: "Clientes");
        }
    }
}

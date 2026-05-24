using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Vigia.Migrations
{
    /// <inheritdoc />
    public partial class AdicionandoTabelasDeAgendamento : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Ambulancias",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Placa = table.Column<string>(type: "TEXT", nullable: false),
                    Modelo = table.Column<string>(type: "TEXT", nullable: false),
                    StatusDisponibilidade = table.Column<bool>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Ambulancias", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Atendentes",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Nome = table.Column<string>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    SenhaHash = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Atendentes", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Agendamentos",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    ClienteId = table.Column<Guid>(type: "TEXT", nullable: false),
                    DataHoraSolicitada = table.Column<DateTime>(type: "TEXT", nullable: false),
                    EnderecoOrigem = table.Column<string>(type: "TEXT", nullable: false),
                    EnderecoDestino = table.Column<string>(type: "TEXT", nullable: false),
                    PrioridadeSugerida = table.Column<int>(type: "INTEGER", nullable: false),
                    PrioridadeConfirmada = table.Column<int>(type: "INTEGER", nullable: true),
                    AtendenteAprovadorId = table.Column<Guid>(type: "TEXT", nullable: true),
                    DataHoraAprovacao = table.Column<DateTime>(type: "TEXT", nullable: true),
                    AmbulanciaId = table.Column<Guid>(type: "TEXT", nullable: true),
                    DataHoraInicio = table.Column<DateTime>(type: "TEXT", nullable: true),
                    DataHoraFim = table.Column<DateTime>(type: "TEXT", nullable: true),
                    Status = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Agendamentos", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Agendamentos_Ambulancias_AmbulanciaId",
                        column: x => x.AmbulanciaId,
                        principalTable: "Ambulancias",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Agendamentos_Atendentes_AtendenteAprovadorId",
                        column: x => x.AtendenteAprovadorId,
                        principalTable: "Atendentes",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Agendamentos_Clientes_ClienteId",
                        column: x => x.ClienteId,
                        principalTable: "Clientes",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Agendamentos_AmbulanciaId",
                table: "Agendamentos",
                column: "AmbulanciaId");

            migrationBuilder.CreateIndex(
                name: "IX_Agendamentos_AtendenteAprovadorId",
                table: "Agendamentos",
                column: "AtendenteAprovadorId");

            migrationBuilder.CreateIndex(
                name: "IX_Agendamentos_ClienteId",
                table: "Agendamentos",
                column: "ClienteId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Agendamentos");

            migrationBuilder.DropTable(
                name: "Ambulancias");

            migrationBuilder.DropTable(
                name: "Atendentes");
        }
    }
}

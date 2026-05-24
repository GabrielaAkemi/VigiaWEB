using Vigia.Common;
using Vigia.Data;
using Vigia.DTOs.Agendamento;
using Vigia.Entities;
using Vigia.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Vigia.Services;

public class AgendamentoService(AppDbContext context) : IAgendamentoService
{
    public async Task<ServiceResult<Agendamento>> CriarAgendamentoAsync(CriarAgendamentoDTO dto)
    {
        try
        {
            // Monta o objeto de agendamento usando os dados do DTO
            var novoAgendamento = new Agendamento
            {
                ClienteId = dto.ClienteId,
                EnderecoOrigem = dto.EnderecoOrigem,
                EnderecoDestino = dto.EnderecoDestino,
                PrioridadeSugerida = dto.PrioridadeSugerida,
                DataHoraSolicitada = DateTime.UtcNow,
                Status = 0 // 0 = Pendente de aprovação do Gestor
            };

            // Salva no banco de dados
            context.Agendamentos.Add(novoAgendamento);
            await context.SaveChangesAsync();

            return ServiceResult<Agendamento>.Criado(novoAgendamento);
        }
        catch (Exception ex)
        {
            return ServiceResult<Agendamento>.Falha($"Erro ao criar agendamento: {ex.Message}", 500);
        }
    }

    public async Task<ServiceResult<List<AgendamentoPendenteDTO>>> ListarPendentesAsync()
    {
        try
        {
            // Vai à base de dados, filtra por Status = 0 (Pendente) e inclui os dados do Cliente
            var pendentes = await context.Agendamentos
                .Include(a => a.Cliente)
                .Where(a => a.Status == 0)
                .Select(a => new AgendamentoPendenteDTO
                {
                    Id = a.Id,
                    NomeCidadao = a.Cliente != null ? a.Cliente.NomeCompleto : "Desconhecido",
                    DataHoraSolicitada = a.DataHoraSolicitada,
                    EnderecoOrigem = a.EnderecoOrigem,
                    EnderecoDestino = a.EnderecoDestino,
                    PrioridadeSugerida = a.PrioridadeSugerida.ToString()
                })
                .OrderByDescending(a => a.PrioridadeSugerida) // Ordena para mostrar os mais urgentes primeiro!
                .ThenBy(a => a.DataHoraSolicitada) // Depois ordena por quem pediu há mais tempo
                .ToListAsync();

            return ServiceResult<List<AgendamentoPendenteDTO>>.Ok(pendentes);
        }
        catch (Exception ex)
        {
            return ServiceResult<List<AgendamentoPendenteDTO>>.Falha($"Erro ao buscar pendentes: {ex.Message}", 500);
        }
    }

    public async Task<ServiceResult<Agendamento>> AprovarAgendamentoAsync(Guid id, AprovarAgendamentoDTO dto)
    {
        try
        {
            // 1. Procura o agendamento específico na base de dados
            var agendamento = await context.Agendamentos.FindAsync(id);

            if (agendamento == null)
                return ServiceResult<Agendamento>.Falha("Agendamento não encontrado.", 404);

            // 2. Verifica se ele já foi aprovado ou cancelado antes
            if (agendamento.Status != 0)
                return ServiceResult<Agendamento>.Falha("Este agendamento já não se encontra pendente.", 400);

            // 3. Altera os dados para APROVADO
            agendamento.Status = 1; // 1 = Aprovado
            agendamento.AtendenteAprovadorId = dto.AtendenteId;
            agendamento.AmbulanciaId = dto.AmbulanciaId;
            agendamento.DataHoraAprovacao = DateTime.UtcNow; // Regista a hora exata do clique

            // 4. Guarda as alterações
            context.Agendamentos.Update(agendamento);
            await context.SaveChangesAsync();

            return ServiceResult<Agendamento>.Ok(agendamento);
        }
        catch (Exception ex)
        {
            return ServiceResult<Agendamento>.Falha($"Erro ao aprovar agendamento: {ex.Message}", 500);
        }
    }
}
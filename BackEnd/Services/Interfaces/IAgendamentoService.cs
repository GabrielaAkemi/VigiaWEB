using Vigia.Common;
using Vigia.DTOs.Agendamento;

namespace Vigia.Services.Interfaces;

public interface IAgendamentoService
{
    Task<ServiceResult<Entities.Agendamento>> CriarAgendamentoAsync(CriarAgendamentoDTO dto);
    Task<ServiceResult<List<AgendamentoPendenteDTO>>> ListarPendentesAsync();
    Task<ServiceResult<Entities.Agendamento>> AprovarAgendamentoAsync(Guid id, AprovarAgendamentoDTO dto);
}
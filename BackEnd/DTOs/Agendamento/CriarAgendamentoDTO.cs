using Vigia.Entities;

namespace Vigia.DTOs.Agendamento;

public class CriarAgendamentoDTO
{
    public Guid ClienteId { get; set; } // ID do cidadão logado que está pedindo
    public string EnderecoOrigem { get; set; } = string.Empty;
    public string EnderecoDestino { get; set; } = string.Empty;
    public NivelPrioridade PrioridadeSugerida { get; set; } // Baseado nos dados clínicos dele
}
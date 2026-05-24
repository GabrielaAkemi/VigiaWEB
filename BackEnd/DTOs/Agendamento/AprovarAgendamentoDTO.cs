namespace Vigia.DTOs.Agendamento;

public class AprovarAgendamentoDTO
{
    public Guid AtendenteId { get; set; } // O ID do gestor que clicou em "Aprovar"
    public Guid? AmbulanciaId { get; set; } // O ID da ambulância escolhida (opcional por agora)
}
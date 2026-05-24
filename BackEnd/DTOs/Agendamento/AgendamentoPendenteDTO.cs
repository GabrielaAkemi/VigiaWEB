namespace Vigia.DTOs.Agendamento;

public class AgendamentoPendenteDTO
{
    public Guid Id { get; set; } // ID do Agendamento
    public string NomeCidadao { get; set; } = string.Empty;
    public DateTime DataHoraSolicitada { get; set; }
    public string EnderecoOrigem { get; set; } = string.Empty;
    public string EnderecoDestino { get; set; } = string.Empty;
    public string PrioridadeSugerida { get; set; } = string.Empty;
}
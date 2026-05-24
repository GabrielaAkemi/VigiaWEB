namespace Vigia.Entities;

public class Agendamento
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    // Relação com Cliente (Cidadão)
    public Guid ClienteId { get; set; }
    public Cliente? Cliente { get; set; }
    
    public DateTime DataHoraSolicitada { get; set; } = DateTime.UtcNow;
    public string EnderecoOrigem { get; set; } = string.Empty;
    public string EnderecoDestino { get; set; } = string.Empty;
    
    // Prioridade
    public NivelPrioridade PrioridadeSugerida { get; set; }
    public NivelPrioridade? PrioridadeConfirmada { get; set; }
    
    // Relação com Atendente (Gestor do Hospital)
    public Guid? AtendenteAprovadorId { get; set; }
    public Atendente? AtendenteAprovador { get; set; }
    public DateTime? DataHoraAprovacao { get; set; }
    
    // Execução
    public Guid? AmbulanciaId { get; set; }
    public Ambulancia? Ambulancia { get; set; }
    public DateTime? DataHoraInicio { get; set; }
    public DateTime? DataHoraFim { get; set; }
    
    public int Status { get; set; } = 0; // 0=Pendente, 1=Aprovado, 2=Em Andamento, 3=Finalizado, 4=Cancelado
}
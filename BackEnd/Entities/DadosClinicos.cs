namespace Vigia.Entities;

public class DadosClinicos
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? CartaoSus { get; set; }
    public string? Alergias { get; set; }
    public string? MedicamentosUsoContinuo { get; set; }
    public string? Comorbidades { get; set; }
    public bool TratamentoOncologico { get; set; }
    public bool QuimioterapiaOuRadioterapia { get; set; }
    public bool DoencaPulmonarCronicaDpoc { get; set; }
    public bool PosOperatorioRecente { get; set; }
    public bool Hemodialise { get; set; }
    public bool CardiopatiaGrave { get; set; }
    public bool GestacaoAltoRisco { get; set; }
    public bool CuidadosPaliativos { get; set; }
    public Guid ClienteId { get; set; }
    public Cliente? Cliente { get; set; }
}
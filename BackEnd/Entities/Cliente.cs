namespace Vigia.Entities;

public class Cliente
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string NomeCompleto { get; set; } = string.Empty;
    public int Idade { get; set; }
    public string Cpf { get; set; } = string.Empty;
    public string Rg { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Telefone { get; set; } = string.Empty;
    public string EnderecoCompleto { get; set; } = string.Empty;
    public string? ContatoEmergenciaNome { get; set; }
    public string? ContatoEmergenciaTelefone { get; set; }
    public string SenhaHash { get; set; } = string.Empty;
    public NivelPrioridade Prioridade { get; set; } = NivelPrioridade.Normal;
    public DateTime CriadoEm { get; set; } = DateTime.UtcNow;
    public MobilidadeNecessidades? Mobilidade { get; set; }
    public DadosClinicos? DadosClinicos { get; set; }
}

public enum NivelPrioridade
{
    Normal = 0,
    Prioritario = 1,
    Critico = 2
}
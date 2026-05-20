using System.ComponentModel.DataAnnotations;

namespace Vigia.DTOs.Auth;

public class RegisterRequestDTO
{
    [Required]
    public string NomeCompleto { get; set; } = string.Empty;

    [Required]
    public int Idade { get; set; }

    [Required]
    public string Cpf { get; set; } = string.Empty;

    [Required]
    public string Rg { get; set; } = string.Empty;

    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Telefone { get; set; } = string.Empty;

    [Required]
    public string EnderecoCompleto { get; set; } = string.Empty;

    public string? ContatoEmergenciaNome { get; set; }
    public string? ContatoEmergenciaTelefone { get; set; }

    [Required]
    public MobilidadeDTO Mobilidade { get; set; } = new();

    [Required]
    public DadosClinicosDTO DadosClinicos { get; set; } = new();

    [Required]
    public string Senha { get; set; } = string.Empty;

    [Required]
    public string ConfirmarSenha { get; set; } = string.Empty;

    public bool AceitouTermos { get; set; }
}

public class MobilidadeDTO
{
    [Required]
    public string CondicaoMobilidade { get; set; } = string.Empty;

    [Required]
    public string TipoSanguineo { get; set; } = string.Empty;

    public bool NecessitaAcompanhante { get; set; }
    public bool TransporteExclusivoEmMaca { get; set; }
    public bool UsoContínuoDeOxigenio { get; set; }
    public bool PacienteBeriatrico { get; set; }
}

public class DadosClinicosDTO
{
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
}
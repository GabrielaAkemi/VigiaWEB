using System.ComponentModel.DataAnnotations;

namespace Vigia.DTOs.Auth;

public class LoginRequestDTO
{
    [Required]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Senha { get; set; } = string.Empty;
}

public class AuthResponseDTO
{
    public string AccessToken { get; set; } = string.Empty;
    public string TokenType { get; set; } = "Bearer";
    public int ExpiresIn { get; set; }
    public ClienteResumoDTO Cliente { get; set; } = new();
}

public class ClienteResumoDTO
{
    public Guid Id { get; set; }
    public string NomeCompleto { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Prioridade { get; set; } = string.Empty;
}
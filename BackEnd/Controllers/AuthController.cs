using Microsoft.AspNetCore.Mvc;
using Vigia.DTOs.Auth;
using Vigia.Services.Interfaces;

namespace Vigia.Controllers;

[ApiController]
[Route("api/auth")]
[Produces("application/json")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequestDTO dto)
    {
        var resultado = await authService.RegisterAsync(dto);

        if (!resultado.Sucesso)
            return StatusCode(resultado.StatusCode, new { erro = resultado.ErroMensagem });

        return StatusCode(201, resultado.Dados);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequestDTO dto)
    {
        var resultado = await authService.LoginAsync(dto);

        if (!resultado.Sucesso)
            return StatusCode(resultado.StatusCode, new { erro = resultado.ErroMensagem });

        return Ok(resultado.Dados);
    }


    [HttpPost("login-gestor")]
    public async Task<ActionResult<AuthResponseDTO>> LoginGestor([FromBody] LoginRequestDTO request)
    {
        var result = await authService.LoginGestorAsync(request);

        if (!result.Sucesso)
        {
            return StatusCode(result.StatusCode, new { mensagem = result.ErroMensagem });
        }

        return Ok(result.Dados);
    }

    [HttpPost("register-gestor")]
    public async Task<IActionResult> RegisterGestor([FromBody] RegisterGestorDTO dto)
    {
        var resultado = await authService.RegisterGestorAsync(dto);

        if (!resultado.Sucesso)
            return StatusCode(resultado.StatusCode, new { erro = resultado.ErroMensagem });

        return StatusCode(201, resultado.Dados);
    }
}
using Microsoft.AspNetCore.Mvc;
using Vigia.DTOs.Agendamento;
using Vigia.Services.Interfaces;

namespace Vigia.Controllers;

[ApiController]
[Route("api/agendamentos")]
[Produces("application/json")]
public class AgendamentoController(IAgendamentoService agendamentoService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CriarAgendamento([FromBody] CriarAgendamentoDTO dto)
    {
        var resultado = await agendamentoService.CriarAgendamentoAsync(dto);

        if (!resultado.Sucesso)
            return StatusCode(resultado.StatusCode, new { erro = resultado.ErroMensagem });

        // 201 significa "Created" (Criado com sucesso)
        return StatusCode(201, resultado.Dados);
    }

    [HttpGet("pendentes")]
    public async Task<IActionResult> ListarPendentes()
    {
        var resultado = await agendamentoService.ListarPendentesAsync();

        if (!resultado.Sucesso)
            return StatusCode(resultado.StatusCode, new { erro = resultado.ErroMensagem });

        return Ok(resultado.Dados); // Retorna a lista de pendentes com o código 200 (OK)
    }

    [HttpPut("{id}/aprovar")]
    public async Task<IActionResult> AprovarAgendamento(Guid id, [FromBody] AprovarAgendamentoDTO dto)
    {
        var resultado = await agendamentoService.AprovarAgendamentoAsync(id, dto);

        if (!resultado.Sucesso)
            return StatusCode(resultado.StatusCode, new { erro = resultado.ErroMensagem });

        return Ok(resultado.Dados);
    }
}
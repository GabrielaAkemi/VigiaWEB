using Microsoft.AspNetCore.Mvc;
using Vigia.DTOs.Ambulancia;
using Vigia.Services.Interfaces;

namespace Vigia.Controllers;

[ApiController]
[Route("api/ambulancias")]
[Produces("application/json")]
public class AmbulanciaController(IAmbulanciaService ambulanciaService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> CriarAmbulancia([FromBody] CriarAmbulanciaDTO dto)
    {
        var resultado = await ambulanciaService.CriarAmbulanciaAsync(dto);

        if (!resultado.Sucesso)
            return StatusCode(resultado.StatusCode, new { erro = resultado.ErroMensagem });

        return StatusCode(201, resultado.Dados);
    }
}
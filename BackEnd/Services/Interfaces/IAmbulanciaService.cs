using Vigia.Common;
using Vigia.DTOs.Ambulancia;

namespace Vigia.Services.Interfaces;

public interface IAmbulanciaService
{
    Task<ServiceResult<Entities.Ambulancia>> CriarAmbulanciaAsync(CriarAmbulanciaDTO dto);
}
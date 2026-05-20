using Vigia.Common;
using Vigia.DTOs.Auth;

namespace Vigia.Services.Interfaces;

public interface IAuthService
{
    Task<ServiceResult<AuthResponseDTO>> RegisterAsync(RegisterRequestDTO dto);
    Task<ServiceResult<AuthResponseDTO>> LoginAsync(LoginRequestDTO dto);
}
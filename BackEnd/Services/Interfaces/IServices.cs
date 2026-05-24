using Vigia.Common;
using Vigia.DTOs.Auth;

namespace Vigia.Services.Interfaces;

public interface IAuthService
{
    Task<ServiceResult<AuthResponseDTO>> RegisterAsync(RegisterRequestDTO dto);
    Task<ServiceResult<AuthResponseDTO>> LoginAsync(LoginRequestDTO dto);
    Task<ServiceResult<AuthResponseDTO>> LoginGestorAsync(LoginRequestDTO dto);
    Task<ServiceResult<AuthResponseDTO>> RegisterGestorAsync(RegisterGestorDTO dto);
}
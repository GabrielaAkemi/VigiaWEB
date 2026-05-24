using Vigia.Common;
using Vigia.Data;
using Vigia.DTOs.Ambulancia;
using Vigia.Entities;
using Vigia.Services.Interfaces;

namespace Vigia.Services;

public class AmbulanciaService(AppDbContext context) : IAmbulanciaService
{
    public async Task<ServiceResult<Ambulancia>> CriarAmbulanciaAsync(CriarAmbulanciaDTO dto)
    {
        try
        {
            var novaAmbulancia = new Ambulancia
            {
                Placa = dto.Placa,
                Modelo = dto.Modelo,
                StatusDisponibilidade = true // Quando é criada, entra automaticamente como disponível
            };

            context.Ambulancias.Add(novaAmbulancia);
            await context.SaveChangesAsync();

            return ServiceResult<Ambulancia>.Criado(novaAmbulancia);
        }
        catch (Exception ex)
        {
            return ServiceResult<Ambulancia>.Falha($"Erro ao criar ambulância: {ex.Message}", 500);
        }
    }
}
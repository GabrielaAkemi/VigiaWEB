using Vigia.Common;
using Vigia.Data;
using Vigia.DTOs.Auth;
using Vigia.Entities;
using Vigia.Services.Interfaces;
using BC = BCrypt.Net.BCrypt;
using Microsoft.EntityFrameworkCore;

namespace Vigia.Services;

public class AuthService(AppDbContext context) : IAuthService
{
    public async Task<ServiceResult<AuthResponseDTO>> RegisterAsync(RegisterRequestDTO dto)
    {
        // Validar se as senhas coincidem
        if (dto.Senha != dto.ConfirmarSenha)
        {
            return ServiceResult<AuthResponseDTO>.Falha(
                "As senhas não coincidem",
                400
            );
        }

        // Verificar se email já existe
        var clienteExistente = await context.Clientes.FirstOrDefaultAsync(c => c.Email == dto.Email);
        if (clienteExistente != null)
        {
            return ServiceResult<AuthResponseDTO>.Falha(
                "Este email já está registrado",
                400
            );
        }

        // Verificar se CPF já existe
        var clientePorCpf = await context.Clientes.FirstOrDefaultAsync(c => c.Cpf == dto.Cpf);
        if (clientePorCpf != null)
        {
            return ServiceResult<AuthResponseDTO>.Falha(
                "Este CPF já está registrado",
                400
            );
        }

        try
        {
            // Criar novo cliente
            var cliente = new Cliente
            {
                NomeCompleto = dto.NomeCompleto,
                Idade = dto.Idade,
                Cpf = dto.Cpf,
                Rg = dto.Rg,
                Email = dto.Email,
                Telefone = dto.Telefone,
                EnderecoCompleto = dto.EnderecoCompleto,
                ContatoEmergenciaNome = dto.ContatoEmergenciaNome,
                ContatoEmergenciaTelefone = dto.ContatoEmergenciaTelefone,
                SenhaHash = BC.HashPassword(dto.Senha),
                Prioridade = DeterminarPrioridade(dto.DadosClinicos),
                CriadoEm = DateTime.UtcNow
            };

            // Criar dados de mobilidade
            if (dto.Mobilidade != null)
            {
                cliente.Mobilidade = new MobilidadeNecessidades
                {
                    ClienteId = cliente.Id,
                    CondicaoMobilidade = dto.Mobilidade.CondicaoMobilidade,
                    TipoSanguineo = dto.Mobilidade.TipoSanguineo,
                    NecessitaAcompanhante = dto.Mobilidade.NecessitaAcompanhante,
                    TransporteExclusivoEmMaca = dto.Mobilidade.TransporteExclusivoEmMaca,
                    UsoContínuoDeOxigenio = dto.Mobilidade.UsoContínuoDeOxigenio,
                    PacienteBeriatrico = dto.Mobilidade.PacienteBeriatrico
                };
            }

            // Criar dados clínicos
            if (dto.DadosClinicos != null)
            {
                cliente.DadosClinicos = new DadosClinicos
                {
                    ClienteId = cliente.Id,
                    CartaoSus = dto.DadosClinicos.CartaoSus,
                    Alergias = dto.DadosClinicos.Alergias,
                    MedicamentosUsoContinuo = dto.DadosClinicos.MedicamentosUsoContinuo,
                    Comorbidades = dto.DadosClinicos.Comorbidades,
                    TratamentoOncologico = dto.DadosClinicos.TratamentoOncologico,
                    QuimioterapiaOuRadioterapia = dto.DadosClinicos.QuimioterapiaOuRadioterapia,
                    DoencaPulmonarCronicaDpoc = dto.DadosClinicos.DoencaPulmonarCronicaDpoc,
                    PosOperatorioRecente = dto.DadosClinicos.PosOperatorioRecente,
                    Hemodialise = dto.DadosClinicos.Hemodialise,
                    CardiopatiaGrave = dto.DadosClinicos.CardiopatiaGrave,
                    GestacaoAltoRisco = dto.DadosClinicos.GestacaoAltoRisco,
                    CuidadosPaliativos = dto.DadosClinicos.CuidadosPaliativos
                };
            }

            context.Clientes.Add(cliente);
            await context.SaveChangesAsync();

            // Retornar resposta SEM fazer login automático
            // O cliente deve fazer login manualmente
            var response = new AuthResponseDTO
            {
                AccessToken = string.Empty,
                ExpiresIn = 0,
                Cliente = new ClienteResumoDTO
                {
                    Id = cliente.Id,
                    NomeCompleto = cliente.NomeCompleto,
                    Email = cliente.Email,
                    Prioridade = cliente.Prioridade.ToString()
                }
            };

            return ServiceResult<AuthResponseDTO>.Criado(response);
        }
        catch (Exception ex)
        {
            return ServiceResult<AuthResponseDTO>.Falha(
                $"Erro ao registrar cliente: {ex.Message}",
                500
            );
        }
    }

    public async Task<ServiceResult<AuthResponseDTO>> LoginAsync(LoginRequestDTO dto)
    {
        try
        {
            // Buscar cliente por email
            var cliente = await context.Clientes
                .Include(c => c.Mobilidade)
                .Include(c => c.DadosClinicos)
                .FirstOrDefaultAsync(c => c.Email == dto.Email);

            if (cliente == null)
            {
                return ServiceResult<AuthResponseDTO>.NaoAutorizado(
                    "Email ou senha incorretos"
                );
            }

            // Validar senha
            if (!BC.Verify(dto.Senha, cliente.SenhaHash))
            {
                return ServiceResult<AuthResponseDTO>.NaoAutorizado(
                    "Email ou senha incorretos"
                );
            }

            // Gerar token JWT (temporariamente usando fake token - implementar JWT depois)
            var token = $"fake-jwt-token-{cliente.Id}";
            var expiresIn = 3600; // 1 hora

            var response = new AuthResponseDTO
            {
                AccessToken = token,
                TokenType = "Bearer",
                ExpiresIn = expiresIn,
                Cliente = new ClienteResumoDTO
                {
                    Id = cliente.Id,
                    NomeCompleto = cliente.NomeCompleto,
                    Email = cliente.Email,
                    Prioridade = cliente.Prioridade.ToString()
                }
            };

            return ServiceResult<AuthResponseDTO>.Ok(response);
        }
        catch (Exception ex)
        {
            return ServiceResult<AuthResponseDTO>.Falha(
                $"Erro ao fazer login: {ex.Message}",
                500
            );
        }
    }

    /// <summary>
    /// Determina o nível de prioridade com base nos dados clínicos
    /// </summary>
    private static NivelPrioridade DeterminarPrioridade(DadosClinicosDTO dadosClinicos)
    {
        if (dadosClinicos == null)
            return NivelPrioridade.Normal;

        // Se tiver qualquer condição crítica, é prioritário
        if (dadosClinicos.TratamentoOncologico ||
            dadosClinicos.QuimioterapiaOuRadioterapia ||
            dadosClinicos.Hemodialise ||
            dadosClinicos.CardiopatiaGrave ||
            dadosClinicos.GestacaoAltoRisco ||
            dadosClinicos.CuidadosPaliativos)
        {
            return NivelPrioridade.Prioritario;
        }

        // Se tiver múltiplas condições
        int contagemCondicoes = 0;
        if (dadosClinicos.DoencaPulmonarCronicaDpoc) contagemCondicoes++;
        if (dadosClinicos.PosOperatorioRecente) contagemCondicoes++;

        if (contagemCondicoes >= 2)
            return NivelPrioridade.Prioritario;

        return NivelPrioridade.Normal;
    }
}
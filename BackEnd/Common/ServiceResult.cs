namespace Vigia.Common;

public class ServiceResult<T>
{
    public bool Sucesso { get; private set; }
    public T? Dados { get; private set; }
    public string? ErroMensagem { get; private set; }
    public int StatusCode { get; private set; }

    private ServiceResult() { }

    public static ServiceResult<T> Ok(T dados) =>
        new() { Sucesso = true, Dados = dados, StatusCode = 200 };

    public static ServiceResult<T> Criado(T dados) =>
        new() { Sucesso = true, Dados = dados, StatusCode = 201 };

    public static ServiceResult<T> Falha(string mensagem, int statusCode = 400) =>
        new() { Sucesso = false, ErroMensagem = mensagem, StatusCode = statusCode };

    public static ServiceResult<T> NaoAutorizado(string mensagem = "Credenciais inválidas.") =>
        new() { Sucesso = false, ErroMensagem = mensagem, StatusCode = 401 };
}
namespace Vigia.Entities;

public class Ambulancia
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Placa { get; set; } = string.Empty;
    public string Modelo { get; set; } = string.Empty;
    public bool StatusDisponibilidade { get; set; } = true;
}
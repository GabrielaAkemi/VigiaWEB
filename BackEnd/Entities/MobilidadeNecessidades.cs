namespace Vigia.Entities;

public class MobilidadeNecessidades
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string? CondicaoMobilidade { get; set; }
    public string? TipoSanguineo { get; set; }
    public bool NecessitaAcompanhante { get; set; }
    public bool TransporteExclusivoEmMaca { get; set; }
    public bool UsoContínuoDeOxigenio { get; set; }
    public bool PacienteBeriatrico { get; set; }
    public Guid ClienteId { get; set; }
    public Cliente? Cliente { get; set; }
}
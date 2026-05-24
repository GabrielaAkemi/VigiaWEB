using Microsoft.EntityFrameworkCore;
using Vigia.Entities;

namespace Vigia.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<Cliente> Clientes => Set<Cliente>();
    public DbSet<MobilidadeNecessidades> MobilidadeNecessidades => Set<MobilidadeNecessidades>();
    public DbSet<DadosClinicos> DadosClinicos => Set<DadosClinicos>();
    public DbSet<Agendamento> Agendamentos => Set<Agendamento>();
    public DbSet<Ambulancia> Ambulancias => Set<Ambulancia>();
    public DbSet<Atendente> Atendentes => Set<Atendente>();
}
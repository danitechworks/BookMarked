using BookMarked.Models;
using Microsoft.EntityFrameworkCore;

namespace BookMarked.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Book> Books { get; set; }

    public DbSet<Quote> Quotes { get; set; }

    public DbSet<User> Users { get; set; }
}

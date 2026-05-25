using Microsoft.EntityFrameworkCore;
using WebTechTodoList.Models;

namespace WebTechTodoList.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
    {
    }

    public DbSet<User> Users => Set<User>();
    public DbSet<TodoItem> TodoItems => Set<TodoItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>()
            .HasIndex(user => user.Email)
            .IsUnique();

        modelBuilder.Entity<TodoItem>()
            .HasOne(todo => todo.User)
            .WithMany(user => user.TodoItems)
            .HasForeignKey(todo => todo.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}

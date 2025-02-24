using Domain;
using Domain.Entities;
using Infrastructure.Configurations.Entities;
using Microsoft.EntityFrameworkCore;

namespace Infrastructure.Persistent;

public class ApplicationDbContext : DbContext
{
    public virtual DbSet<Brand> Brands { get; set; }
    public virtual DbSet<Category> Categories { get; set; }
    public virtual DbSet<Order> Orders { get; set; }
    public virtual DbSet<OrderItem> OrderItems { get; set; }
    public virtual DbSet<Post> Posts { get; set; }
    public virtual DbSet<Product> Products { get; set; }

    // public virtual DbSet<ProductCollection> ProductCollections { get; set; }
    public virtual DbSet<Review> Reviews { get; set; }
    public virtual DbSet<Role> Roles { get; set; }
    public virtual DbSet<User> Users { get; set; }

    // public virtual DbSet<Wishlist> Wishlists { get; set; }

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ProductEntityConfiguration).Assembly);
    }
}

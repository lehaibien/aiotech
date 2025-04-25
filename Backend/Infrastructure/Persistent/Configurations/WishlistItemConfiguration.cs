namespace Infrastructure.Persistent.Configurations;

using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

internal sealed class WishlistItemConfiguration : IEntityTypeConfiguration<WishlistItem>
{
    /// <summary>
    /// Configures the entity mapping for the <c>WishlistItem</c> entity, including table name, primary key, required properties, default values, and relationships.
    /// </summary>
    public void Configure(EntityTypeBuilder<WishlistItem> builder)
    {
        builder.ToTable("WishlistItem");
        builder.HasKey(wi => wi.Id);
        builder.Property(wi => wi.Id).ValueGeneratedOnAdd();
        builder.Property(wi => wi.UserId).IsRequired();
        builder.Property(wi => wi.ProductId).IsRequired();
        builder.Property(wi => wi.CreatedAt).IsRequired().HasDefaultValueSql("CURRENT_TIMESTAMP");
        builder.HasOne(wi => wi.User)
            .WithMany(u => u.WishlistItems)
            .HasForeignKey(wi => wi.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        builder.HasOne(wi => wi.Product)
            .WithMany()
            .HasForeignKey(wi => wi.ProductId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
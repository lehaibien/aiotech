using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Entities;

public class CartItemEntityConfiguration : IEntityTypeConfiguration<CartItem>
{
    public void Configure(EntityTypeBuilder<CartItem> builder)
    {
        builder.HasKey(x => new { x.UserId, x.ProductId });
        builder.Property(x => x.ProductId).IsRequired();
        builder.Property(x => x.Quantity).HasDefaultValue(1);
        builder.ToTable("CartItem");
    }
}

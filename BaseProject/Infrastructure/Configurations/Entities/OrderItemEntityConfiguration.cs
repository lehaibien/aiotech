using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Entities;

public class OrderItemEntityConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.HasKey(x => x.Id).HasName("PK_OrderItemId");
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        builder.Property(x => x.OrderId).IsRequired();
        builder.Property(x => x.ProductId).IsRequired();
        builder.Property(x => x.Quantity).IsRequired().HasDefaultValue(1);
        builder.ToTable(b => b.HasCheckConstraint("CK_OrderItem_Quantity", "Quantity > 0"));
        builder.Property(x => x.Price).IsRequired().HasPrecision(10, 2).HasDefaultValue(0);
        builder.ToTable(b => b.HasCheckConstraint("CK_OrderItem_Price", "Price >= 0"));
        builder
            .HasOne(x => x.Order)
            .WithMany(x => x.OrderItems)
            .HasForeignKey(x => x.OrderId)
            .HasPrincipalKey(x => x.Id)
            .IsRequired()
            .HasConstraintName("FK_OrderItem_OrderId")
            .OnDelete(DeleteBehavior.NoAction);
        builder.ToTable("OrderItem");
    }
}

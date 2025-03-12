using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistent.Configurations;

public class OrderEntityConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(x => x.Id).HasName("PK_OrderId");
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        builder.Property(x => x.CustomerId).IsRequired();
        builder.Property(x => x.TrackingNumber).IsUnicode(false).IsRequired();
        builder.Property(x => x.Tax);
        builder.Property(x => x.TotalPrice);
        builder
            .Property(x => x.Status)
            .HasConversion(v => v.ToString(), v => (OrderStatus)Enum.Parse(typeof(OrderStatus), v));
        builder.Property(x => x.Note);
        builder.Property(x => x.CancelReason);
        builder.HasQueryFilter(x => x.IsDeleted == false);
        builder
            .HasOne(x => x.Customer)
            .WithMany(x => x.Orders)
            .HasForeignKey(x => x.CustomerId)
            .HasPrincipalKey(x => x.Id)
            .HasConstraintName("FK_Order_CustomerId")
            .OnDelete(DeleteBehavior.NoAction);
        builder
            .HasMany(x => x.OrderItems)
            .WithOne(x => x.Order)
            .HasForeignKey(x => x.OrderId)
            .HasPrincipalKey(x => x.Id)
            .HasConstraintName("FK_Order_OrderItemId")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.CustomerId);
        builder.HasIndex(x => x.TrackingNumber).IsUnique();
        builder.ToTable("Order");
    }
}

using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistent.Configurations;

public class OrderEntityConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.ToTable("Order");
        builder.HasKey(x => x.Id).HasName("PK_OrderId");
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        builder.Property(x => x.CustomerId).IsRequired();
        builder.Property(x => x.PhoneNumber).HasMaxLength(50).IsRequired();
        builder.Property(x => x.Name).HasMaxLength(255).IsRequired();
        builder.Property(x => x.TrackingNumber).IsUnicode(false).HasMaxLength(16).IsRequired();
        builder.Property(x => x.Tax).HasPrecision(18, 2).IsRequired();
        builder.Property(x => x.TotalPrice).HasPrecision(18, 2).IsRequired();
        builder
            .Property(x => x.Status)
            .HasConversion(v => v.ToString(), v => (OrderStatus)Enum.Parse(typeof(OrderStatus), v));
        builder.Property(x => x.Note);
        builder.Property(x => x.CancelReason);
        builder.HasQueryFilter(x => !x.IsDeleted);
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

        builder
            .HasOne(x => x.Payment)
            .WithOne(x => x.Order)
            .HasConstraintName("FK_Order_PaymentId")
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasIndex(x => x.TrackingNumber).IsUnique();
    }
}

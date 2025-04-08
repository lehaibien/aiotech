using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistent.Configurations;

public class DiscountEntityConfiguration : IEntityTypeConfiguration<Discount>
{
    public void Configure(EntityTypeBuilder<Discount> builder)
    {
        builder.HasKey(x => x.Id);

        builder.Property(x => x.Id).ValueGeneratedOnAdd();

        builder.Property(x => x.CouponCode).IsRequired().HasMaxLength(50);

        builder.Property(x => x.DiscountPercentage).IsRequired();

        builder.Property(x => x.ValidUntil).IsRequired();

        builder.Property(x => x.MinimumOrderAmount).IsRequired().HasPrecision(18, 2);

        builder.Property(x => x.MaximumDiscountAmount).HasPrecision(18, 2);

        builder.Property(x => x.Uses);

        builder.ToTable("Discount");
    }
}

using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistent.Configurations;

public class BrandEntityConfiguration : IEntityTypeConfiguration<Brand>
{
    public void Configure(EntityTypeBuilder<Brand> builder)
    {
        builder.HasKey(x => x.Id).HasName("PK_BrandId");
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        builder.Property(x => x.Name).IsRequired().HasMaxLength(255);
        builder.Property(x => x.ImageUrl).IsRequired();
        builder.HasQueryFilter(x => x.IsDeleted == false);
        builder
            .HasMany(x => x.Products)
            .WithOne(x => x.Brand)
            .HasForeignKey(x => x.BrandId)
            .HasPrincipalKey(x => x.Id)
            .OnDelete(DeleteBehavior.Restrict);
        builder.ToTable("Brand");
    }
}

using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistent.Configurations;

public class CategoryEntityConfiguration : IEntityTypeConfiguration<Category>
{
    public void Configure(EntityTypeBuilder<Category> builder)
    {
        builder.HasKey(x => x.Id).HasName("PK_CategoryId");
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        builder.Property(x => x.Name).IsRequired().HasMaxLength(255);
        builder.Property(x => x.ImageUrl).IsRequired();
        builder.HasQueryFilter(x => x.IsDeleted == false);
        builder
            .HasMany(x => x.Products)
            .WithOne()
            .HasForeignKey(x => x.CategoryId)
            .HasPrincipalKey(x => x.Id)
            .HasConstraintName("FK_Product_CategoryId")
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasIndex(x => x.Name);
        builder.ToTable("Category");
    }
}

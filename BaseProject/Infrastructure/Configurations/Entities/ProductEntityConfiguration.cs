﻿using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Configurations.Entities;

public class ProductEntityConfiguration : IEntityTypeConfiguration<Product>
{
    private readonly ValueComparer<List<string>> _urlComparer = new ValueComparer<List<string>>(
        (c1, c2) => c1.SequenceEqual(c2),
        c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
        c => c.ToList()
    );

    public void Configure(EntityTypeBuilder<Product> builder)
    {
        builder.HasKey(x => x.Id).HasName("PK_ProductId");
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        builder.Property(x => x.Sku).IsRequired().IsUnicode().HasMaxLength(50);
        builder.Property(x => x.Name).IsRequired().HasMaxLength(255);
        builder.Property(x => x.Description).HasMaxLength(1000);
        builder.Property(x => x.Price).IsRequired().HasPrecision(10, 2);
        builder.Property(x => x.DiscountPrice).HasPrecision(10, 2);
        builder.ToTable(b => b.HasCheckConstraint("CK_Product_Price", "Price > 0"));
        builder.ToTable(b =>
            b.HasCheckConstraint(
                "CK_Product_DiscountPrice",
                "DiscountPrice >= 0 AND DiscountPrice <= Price"
            )
        );
        builder.Property(x => x.Stock).IsRequired().HasDefaultValue(0);
        builder.Property(x => x.BrandId).IsRequired();
        builder.Property(x => x.CategoryId).IsRequired();
        builder
            .Property(x => x.ImageUrls)
            .HasConversion(
                v => string.Join(',', v),
                v => v.Split(',', StringSplitOptions.RemoveEmptyEntries).ToList()
            )
            .Metadata.SetValueComparer(_urlComparer);
        builder.Property(x => x.IsFeatured).IsRequired().HasDefaultValue(false);
        builder.HasQueryFilter(x => x.IsDeleted == false);
        // Relationships
        builder
            .HasOne(p => p.Category)
            .WithMany(c => c.Products)
            .HasForeignKey(p => p.CategoryId)
            .HasPrincipalKey(c => c.Id)
            .HasConstraintName("FK_Product_CategoryId")
            .IsRequired()
            .OnDelete(DeleteBehavior.NoAction);
        builder
            .HasOne(p => p.Brand)
            .WithMany(b => b.Products)
            .HasForeignKey(p => p.BrandId)
            .HasPrincipalKey(b => b.Id)
            .HasConstraintName("FK_Product_BrandId")
            .IsRequired()
            .OnDelete(DeleteBehavior.NoAction);
        builder
            .HasMany(p => p.Reviews)
            .WithOne(r => r.Product)
            .HasForeignKey(r => r.ProductId)
            .HasPrincipalKey(p => p.Id)
            .HasConstraintName("FK_Review_ProductId")
            .OnDelete(DeleteBehavior.Cascade);
        builder.ToTable("Product");
    }
}

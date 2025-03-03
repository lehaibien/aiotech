using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistent.Configurations;

public class ReviewEntityConfiguration : IEntityTypeConfiguration<Review>
{
    public void Configure(EntityTypeBuilder<Review> builder)
    {
        builder.HasKey(x => x.Id).HasName("PK_ReviewId");
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        builder.Property(x => x.ProductId).IsRequired();
        builder.Property(x => x.UserId).IsRequired();
        builder.Property(x => x.Rating).IsRequired().HasDefaultValue(1);
        builder.ToTable(b => b.HasCheckConstraint("CK_Review_Rating", "Rating BETWEEN 1 AND 5"));
        builder.Property(x => x.Comment).HasMaxLength(1000);
        builder.HasQueryFilter(x => x.IsDeleted == false);
        builder
            .HasOne(x => x.Product)
            .WithMany(x => x.Reviews)
            .HasForeignKey(x => x.ProductId)
            .HasPrincipalKey(x => x.Id)
            .HasConstraintName("FK_Review_ProductId")
            .OnDelete(DeleteBehavior.NoAction);
        builder
            .HasOne(x => x.User)
            .WithMany(x => x.Reviews)
            .HasForeignKey(x => x.UserId)
            .HasPrincipalKey(x => x.Id)
            .HasConstraintName("FK_Review_UserId")
            .OnDelete(DeleteBehavior.NoAction);
        builder.ToTable("Review");
    }
}

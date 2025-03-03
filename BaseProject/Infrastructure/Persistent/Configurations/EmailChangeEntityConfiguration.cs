using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistent.Configurations;

public class EmailChangeEntityConfiguration : IEntityTypeConfiguration<EmailChange>
{
    public void Configure(EntityTypeBuilder<EmailChange> builder)
    {
        builder.HasKey(x => x.UserId).HasName("PK_EmailChangeUserId");
        builder.Property(x => x.UserId).ValueGeneratedOnAdd();
        builder.Property(x => x.OldEmail).IsRequired().HasMaxLength(255);
        builder.Property(x => x.NewEmail).IsRequired().HasMaxLength(255);
        builder.Property(x => x.Token).IsRequired();
        builder.Property(x => x.CreatedDate).IsRequired();
        builder.Property(x => x.ExpiryDate).IsRequired();

        builder
            .HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .HasConstraintName("FK_EmailChange_UserId")
            .OnDelete(DeleteBehavior.Cascade);
        builder.ToTable("EmailChange");
    }
}

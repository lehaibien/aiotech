using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistent.Configurations;

public class UserEntityConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).IsRequired().ValueGeneratedOnAdd();
        builder.Property(x => x.UserName).IsRequired().IsUnicode(false).HasMaxLength(50);
        builder.Property(x => x.FamilyName).HasMaxLength(255);
        builder.Property(x => x.GivenName).IsRequired().HasMaxLength(255);
        builder.Property(x => x.Email).IsRequired().IsUnicode().HasMaxLength(255);
        builder.Property(x => x.PhoneNumber).IsUnicode().HasMaxLength(15);
        builder.Property(x => x.AvatarUrl); // nothing to configure yet
        builder.Property(x => x.Password).IsRequired();
        builder.Property(x => x.Salt).IsRequired();
        builder.Property(x => x.RoleId).IsRequired();
        builder.Property(x => x.IsLocked).IsRequired().HasDefaultValue(false);
        builder.HasQueryFilter(x => x.IsDeleted == false);
        builder
            .HasOne(x => x.Role)
            .WithMany(x => x.Users)
            .HasForeignKey(x => x.RoleId)
            .HasPrincipalKey(x => x.Id)
            .OnDelete(DeleteBehavior.NoAction);
        builder
            .HasMany(x => x.Orders)
            .WithOne(x => x.Customer)
            .HasForeignKey(x => x.CustomerId)
            .HasPrincipalKey(x => x.Id)
            .OnDelete(DeleteBehavior.Cascade);
        builder
            .HasMany(x => x.Reviews)
            .WithOne(x => x.User)
            .HasForeignKey(x => x.UserId)
            .HasPrincipalKey(x => x.Id)
            .OnDelete(DeleteBehavior.Cascade);
        builder.ToTable("User");
    }
}

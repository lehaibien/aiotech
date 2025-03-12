using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistent.Configurations;

public class RoleEntityConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        builder.Property(x => x.Name).IsRequired().HasMaxLength(255);
        builder.HasQueryFilter(x => x.IsDeleted == false);
        builder
            .HasMany(x => x.Users)
            .WithOne(x => x.Role)
            .HasForeignKey(x => x.RoleId)
            .OnDelete(DeleteBehavior.Restrict);
        builder.HasData(
            new Role
            {
                Id = Guid.Parse("85844E35-F6A0-4F8E-90C4-071366BF5FF6"),
                Name = "Admin",
                CreatedDate = DateTime.UtcNow,
                CreatedBy = "system",
            },
            new Role
            {
                Id = Guid.Parse("A8B42A83-B1BC-4937-99D9-0AAA70B896E5"),
                Name = "User",
                CreatedDate = DateTime.UtcNow,
                CreatedBy = "system",
            },
            new Role
            {
                Id = Guid.Parse("B2F02C43-4D58-45D2-84A4-CAF92A976672"),
                Name = "Shipper",
                CreatedDate = DateTime.UtcNow,
                CreatedBy = "system",
            }
        );
        builder.ToTable("Role");
    }
}

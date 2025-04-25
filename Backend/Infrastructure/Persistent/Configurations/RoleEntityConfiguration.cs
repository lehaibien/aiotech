using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistent.Configurations;

public class RoleEntityConfiguration : IEntityTypeConfiguration<Role>
{
    /// <summary>
    /// Configures the Role entity's schema, relationships, query filters, and seeds initial data for Entity Framework Core.
    /// </summary>
    /// <param name="builder">The builder used to configure the Role entity type.</param>
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        builder.Property(x => x.Code).IsRequired().IsUnicode(false).HasMaxLength(255);
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
                Code = "admin",
                Name = "Quản trị",
                CreatedDate = new DateTime(2025, 1, 1),
                CreatedBy = "system",
            },
            new Role
            {
                Id = Guid.Parse("A8B42A83-B1BC-4937-99D9-0AAA70B896E5"),
                Code = "user",
                Name = "Khách hàng",
                CreatedDate = new DateTime(2025, 1, 1),
                CreatedBy = "system",
            },
            new Role
            {
                Id = Guid.Parse("B2F02C43-4D58-45D2-84A4-CAF92A976672"),
                Code = "shipper",
                Name = "Giao hàng",
                CreatedDate = new DateTime(2025, 1, 1),
                CreatedBy = "system",
            }
        );
        builder.ToTable("Role");
    }
}

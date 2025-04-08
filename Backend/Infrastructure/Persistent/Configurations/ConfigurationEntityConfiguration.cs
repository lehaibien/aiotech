using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistent.Configurations;

public class ConfigurationEntityConfiguration : IEntityTypeConfiguration<Configuration>
{
    public void Configure(EntityTypeBuilder<Configuration> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        builder.Property(x => x.Key).IsRequired().HasMaxLength(255).IsUnicode(false);
        builder.Property(x => x.Value).IsRequired();
        builder.HasIndex(x => x.Key).IsUnique();
        builder.ToTable("Configuration");
    }
}

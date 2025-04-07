using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistent.Configurations;

public class PostEntityConfiguration : IEntityTypeConfiguration<Post>
{
    public void Configure(EntityTypeBuilder<Post> builder)
    {
        builder.HasKey(x => x.Id).HasName("PK_PostId");
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        builder.Property(x => x.Title).IsRequired();
        builder.Property(x => x.Content).IsRequired();
        builder.Property(x => x.ImageUrl).IsRequired();
        builder.Property(x => x.IsPublished).IsRequired().HasDefaultValue(true);
        builder.HasQueryFilter(x => !x.IsDeleted);
        builder.HasIndex(x => x.Title);
        builder.ToTable("Post");
    }
}

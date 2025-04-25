using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistent.Configurations;

public class PostEntityConfiguration : IEntityTypeConfiguration<Post>
{
    private readonly ValueComparer<List<string>> _urlComparer = new(
        (c1, c2) => c1!.SequenceEqual(c2!),
        c => c.Aggregate(0, (a, v) => HashCode.Combine(a, v.GetHashCode())),
        c => c.ToList()
    );

    /// <summary>
    /// Configures the entity model for the <c>Post</c> class, including property mappings, value conversions, constraints, indexes, and query filters for use with Entity Framework Core.
    /// </summary>
    public void Configure(EntityTypeBuilder<Post> builder)
    {
        builder.HasKey(x => x.Id).HasName("PK_PostId");
        builder.Property(x => x.Id).ValueGeneratedOnAdd();
        builder.Property(x => x.Title).IsUnicode(true).IsRequired();
        builder.Property(x => x.Content).IsUnicode(true).IsRequired();
        builder.Property(x => x.Slug).IsUnicode(false).IsRequired();
        builder.Property(x => x.ThumbnailUrl).IsRequired();
        builder.Property(x => x.ImageUrl).IsRequired();
        builder.Property(x => x.IsPublished).IsRequired().HasDefaultValue(true);
        builder
            .Property(x => x.Tags)
            .IsUnicode(true)
            .HasConversion(
                v => string.Join(",", v),
                v => v.Split(",", StringSplitOptions.RemoveEmptyEntries).ToList()
            )
            .Metadata.SetValueComparer(_urlComparer);
        builder.HasQueryFilter(x => !x.IsDeleted);
        builder.HasIndex(x => x.Title);
        builder.ToTable("Post");
    }
}

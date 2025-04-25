namespace Domain.Entities;

public class Post : BaseEntity
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Slug { get; set; } = null!;
    public string Content { get; set; } = null!;
    public string ThumbnailUrl { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;
    public bool IsPublished { get; set; }
    public List<string> Tags { get; set; } = [];
}

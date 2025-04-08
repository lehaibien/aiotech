namespace Application.Posts.Dtos;

public class PostPreviewResponse
{
    public Guid Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
}

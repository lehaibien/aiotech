namespace Application.Reviews.Dtos;

public class ReviewProductResponse
{
    public Guid Id { get; set; }
    public string? UserImageUrl { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
    public int Rating { get; set; } = 0;
    public DateTime CreatedDate { get; set; }
}

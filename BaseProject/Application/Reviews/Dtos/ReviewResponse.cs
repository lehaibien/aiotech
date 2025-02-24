using Shared;

namespace Application.Reviews.Dtos;

public class ReviewResponse : BaseResponse
{
    public Guid Id { get; set; }
    public string? UserName { get; set; }
    public string? ProductName { get; set; }
    public double Rating { get; set; } = 0;
    public string? Comment { get; set; }
}

using System.ComponentModel.DataAnnotations;

namespace Application.Reviews.Dtos;

public class ReviewRequest
{
    public Guid ProductId { get; set; }
    public Guid UserId { get; set; }

    [Range(1, 5, ErrorMessage = "Đánh giá phải từ 1 đến 5")]
    public int Rating { get; set; }
    public string? Comment { get; set; }
}

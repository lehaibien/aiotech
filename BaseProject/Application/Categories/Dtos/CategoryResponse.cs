using Shared;

namespace Application.Categories.Dtos;

public class CategoryResponse : BaseResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
}
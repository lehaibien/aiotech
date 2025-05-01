using Application.Shared;

namespace Application.Brands.Dtos;

public class BrandResponse : BaseResponse
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
}

namespace Application.Products.Dtos;

public class ProductUpdateResponse
{
    public Guid Id { get; set; }
    public string? Sku { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public decimal CostPrice { get; set; }
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int Stock { get; set; }
    public Guid BrandId { get; set; }
    public Guid CategoryId { get; set; }
    public string ThumbnailUrl { get; set; } = null!;
    public List<string> Tags { get; set; } = [];
    public List<string> ImageUrls { get; set; } = [];
    public bool IsFeatured { get; set; }
}

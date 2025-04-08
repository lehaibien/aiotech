namespace Application.Products.Dtos;

public class ProductUpdateResponse
{
    public Guid Id { get; set; }
    public string? Sku { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public double Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public int Stock { get; set; }
    public Guid BrandId { get; set; }
    public Guid CategoryId { get; set; }
    public List<string> Tags { get; set; } = [];
    public List<string> ImageUrls { get; set; } = [];
    public bool IsFeatured { get; set; }
}

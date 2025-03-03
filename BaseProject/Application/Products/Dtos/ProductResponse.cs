namespace Application.Products.Dtos;

public class ProductResponse
{
    public Guid Id { get; set; }
    public string Sku { get; set; } = null!;
    public string Name { get; set; } = null!;
    public decimal Price { get; set; }
    public string Brand { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public double Rating { get; set; }
    public int Stock { get; set; }
    public List<string> ImageUrls { get; set; } = [];
    public bool IsFeatured { get; set; }
    public DateTime CreatedDate { get; set; }
}

namespace Application.Reports.Dtos;

public class TopSellingProductResponse
{
    public Guid ProductId { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string ProductName { get; set; } = string.Empty;
    public int TotalQuantitySold { get; set; }
    public double TotalRevenue { get; set; }
    public double AverageRating { get; set; }
}

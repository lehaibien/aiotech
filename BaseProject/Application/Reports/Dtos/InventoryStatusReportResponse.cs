namespace Application.Reports.Dtos;

public class InventoryStatusReportResponse
{
    public Guid Id { get; set; }
    public string Sku { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int CurrentStock { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Brand { get; set; } = string.Empty;
    public List<string> ImageUrls { get; set; } = [];
    public string StockStatus { get; set; } = "In Stock";
    public bool ReorderRecommended { get; set; } = false;
}

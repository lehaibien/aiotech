namespace Application.Reports.Dtos;

public class OutOfStockReportResponse
{
    public Guid Id { get; set; }
    public string Sku { get; set; }
    public string Name { get; set; }
    public int Stock { get; set; }
    public string Category { get; set; }
    public string Brand { get; set; }
    public List<string> ImageUrls { get; set; } = [];
}

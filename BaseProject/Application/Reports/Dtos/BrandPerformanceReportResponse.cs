namespace Application.Reports.Dtos;

public class BrandPerformanceReportResponse
{
    public Guid BrandId { get; set; }
    public string BrandName { get; set; } = null!;
    public int ProductCount { get; set; }
    public double TotalRevenue { get; set; }
    public int TotalUnitsSold { get; set; }
    public double AverageRating { get; set; }
}
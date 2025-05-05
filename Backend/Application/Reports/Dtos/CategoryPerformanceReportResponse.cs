namespace Application.Reports.Dtos;

public class CategoryPerformanceReportResponse
{
    public Guid CategoryId { get; set; }
    public string CategoryName { get; set; } = null!;
    public int ProductCount { get; set; }
    public decimal TotalRevenue { get; set; }
    public int TotalUnitsSold { get; set; }
    public double AverageRating { get; set; }
}
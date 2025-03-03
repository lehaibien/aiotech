namespace Application.Reports.Dtos;

public class TopCustomerReportResponse
{
    public Guid CustomerId { get; set; }
    public string CustomerName { get; set; } = string.Empty;
    public int OrderCount { get; set; }
    public double TotalSpent { get; set; }
    public double AverageOrderValue { get; set; }
    public DateTime FirstPurchaseDate { get; set; }
    public DateTime LatestPurchaseDate { get; set; }
    public int DaysSinceLastPurchase { get; set; }
    public List<string> FrequentlyPurchasedCategories { get; set; } = [];
}

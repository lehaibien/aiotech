namespace Application.Reports.Dtos;

public class SaleReportResponse
{
    public DateTime Date { get; set; }
    public decimal Revenue { get; set; }
    public int TotalOrder { get; set; }
    public int CompletedOrder { get; set; }
    public int CancelledOrder { get; set; }
    public decimal AverageOrderValue { get; set; }
}

namespace Application.Reports.Dtos;

public class SaleReportRequest : BaseReportRequest
{
    public string? Category { get; set; }
    public string? Product { get; set; }
}
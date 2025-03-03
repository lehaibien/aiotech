namespace Application.Reports.Dtos;

public class GetTopCustomerReportRequest : BaseReportRequest
{
    public int Count { get; set; } = 10;
}

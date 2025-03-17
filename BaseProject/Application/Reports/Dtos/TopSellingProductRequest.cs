namespace Application.Reports.Dtos;

public class TopSellingProductRequest : BaseReportRequest
{
    public int PageIndex { get; set; } = 0;
    public int PageSize { get; set; } = 10;
}

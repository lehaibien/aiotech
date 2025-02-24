namespace Application.Reports.Dtos;

public abstract class BaseReportRequest
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }
}

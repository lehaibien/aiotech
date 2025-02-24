using Domain.Entities;

namespace Application.Reports.Dtos;

public class OrderReportRequest : BaseReportRequest
{
    public string? CustomerUsername { get; set; }
}

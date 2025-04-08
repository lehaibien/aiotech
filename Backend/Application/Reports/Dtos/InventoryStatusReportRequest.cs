namespace Application.Reports.Dtos;

public class InventoryStatusReportRequest
{
    public int PageIndex { get; set; }
    public int PageSize { get; set; } = 10;
    public Guid? BrandId { get; set; }
    public Guid? CategoryId { get; set; }
}

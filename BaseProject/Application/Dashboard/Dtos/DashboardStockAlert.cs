namespace Application.Dashboard.Dtos;

public class DashboardStockAlert
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string ProductImage { get; set; } = string.Empty;
    public int Stock { get; set; }
}

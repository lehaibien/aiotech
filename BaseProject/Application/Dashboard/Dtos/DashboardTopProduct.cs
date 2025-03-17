namespace Application.Dashboard.Dtos;

public class DashboardTopProduct
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public int Sales { get; set; }
    public List<string> ImageUrls { get; set; } = [];
}

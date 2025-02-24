namespace Application.Reports.Dtos;

public class LowRatingProductReportResponse
{
    public string ProductName { get; set; } = string.Empty;
    public double AverageRating { get; set; }
}

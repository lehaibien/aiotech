namespace Application.Reports.Dtos;

public class ProductRatingResponse
{
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public double AverageRating { get; set; }
    public int ReviewCount { get; set; }
    public Dictionary<int, int> RatingDistribution { get; set; } = [];
    public double PositiveSentimentPercentage { get; set; }
    public double NegativeSentimentPercentage { get; set; }
}

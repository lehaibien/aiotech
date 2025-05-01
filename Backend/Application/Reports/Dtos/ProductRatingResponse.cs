namespace Application.Reports.Dtos;

public record ProductRatingReportResponse(
    Guid ProductId,
    string ProductName,
    double AverageRating,
    int ReviewCount,
    Dictionary<int, int> RatingDistribution,
    double PositiveSentimentPercentage,
    double NegativeSentimentPercentage
);

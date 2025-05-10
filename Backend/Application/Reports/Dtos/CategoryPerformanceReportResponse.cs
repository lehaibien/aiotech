namespace Application.Reports.Dtos;

public record CategoryPerformanceReportResponse(
    Guid CategoryId,
    string CategoryName,
    int ProductCount,
    decimal TotalRevenue,
    int TotalUnitsSold,
    double AverageRating
);

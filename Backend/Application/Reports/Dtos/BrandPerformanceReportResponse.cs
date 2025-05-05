namespace Application.Reports.Dtos;

public record BrandPerformanceReportResponse(
    Guid BrandId,
    string BrandName,
    int ProductCount,
    decimal TotalRevenue,
    int TotalUnitsSold,
    double AverageRating
);

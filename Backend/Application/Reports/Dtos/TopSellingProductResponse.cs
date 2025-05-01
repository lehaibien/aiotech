namespace Application.Reports.Dtos;

public record TopSellingProductResponse(
    Guid ProductId,
    string Sku,
    string ProductName,
    int TotalQuantitySold,
    double TotalRevenue,
    double AverageRating
);

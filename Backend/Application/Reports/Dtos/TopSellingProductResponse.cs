namespace Application.Reports.Dtos;

public record TopSellingProductResponse(
    Guid ProductId,
    string Sku,
    string ProductName,
    int TotalQuantitySold,
    decimal TotalRevenue,
    double AverageRating
);

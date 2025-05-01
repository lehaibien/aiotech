namespace Application.Reports.Dtos;

public record SaleReportResponse(
    DateTime Date,
    decimal Revenue,
    int TotalOrder,
    int CompletedOrder,
    int CancelledOrder,
    decimal AverageOrderValue
);
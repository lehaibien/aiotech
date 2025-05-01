namespace Application.Reports.Dtos;

public record InventoryStatusReportResponse(
    Guid Id,
    string Sku,
    string Name,
    int CurrentStock,
    string Category,
    string Brand,
    List<string> ImageUrls,
    string StockStatus,
    bool ReorderRecommended
);
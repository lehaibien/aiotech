namespace Application.Channels;

public record ESProductSync(
    Guid Id,
    string Sku,
    string Name,
    string? Description,
    int Stock,
    string Brand,
    string Category,
    double Rating,
    decimal Price,
    decimal? DiscountedPrice,
    string ThumbnailUrl,
    List<string> Tags
);

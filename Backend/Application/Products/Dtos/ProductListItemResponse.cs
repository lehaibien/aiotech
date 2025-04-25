namespace Application.Products.Dtos;

public record ProductListItemResponse(
    Guid Id,
    string Name,
    decimal Price,
    decimal? DiscountPrice,
    int Stock,
    string Brand,
    double Rating,
    string ThumbnailUrl,
    IList<string> Tags
);

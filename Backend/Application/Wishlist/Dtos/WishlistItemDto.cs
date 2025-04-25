namespace Application.Wishlist.Dtos;

public record WishlistItemDto(
    Guid Id,
    Guid ProductId,
    string ProductName,
    string ProductImageUrl,
    decimal ProductPrice
);
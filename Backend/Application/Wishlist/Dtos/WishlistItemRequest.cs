namespace Application.Wishlist.Dtos;

public record WishlistItemRequest(Guid UserId, Guid ProductId);
using Application.Wishlist.Dtos;
using Shared;

namespace Application.Wishlist;
public interface IWishlistService
{
    Task<Result<List<WishlistItemDto>>> GetWishlistAsync(Guid userId);
    Task<Result<WishlistItemDto>> AddItemToWishlistAsync(WishlistItemRequest request);
    Task<Result> RemoveItemFromWishlistAsync(WishlistItemRequest request);
    Task<Result> ClearWishlistAsync(Guid userId);
}
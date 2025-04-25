using Application.Wishlist.Dtos;
using Shared;

namespace Application.Wishlist;
public interface IWishlistService
{
    /// <summary>
/// Retrieves the wishlist items for the specified user.
/// </summary>
/// <param name="userId">The unique identifier of the user whose wishlist is to be fetched.</param>
/// <returns>A task that resolves to a result containing a list of wishlist items.</returns>
Task<Result<List<WishlistItemDto>>> GetWishlistAsync(Guid userId);
    /// <summary>
/// Adds an item to the user's wishlist based on the provided request.
/// </summary>
/// <param name="request">The details of the item to add to the wishlist.</param>
/// <returns>A result containing the added wishlist item if successful.</returns>
Task<Result<WishlistItemDto>> AddItemToWishlistAsync(WishlistItemRequest request);
    /// <summary>
/// Removes a specified item from a user's wishlist.
/// </summary>
/// <param name="request">The details of the item to remove from the wishlist.</param>
/// <returns>A result indicating whether the removal was successful.</returns>
Task<Result> RemoveItemFromWishlistAsync(WishlistItemRequest request);
    /// <summary>
/// Removes all items from the wishlist for the specified user.
/// </summary>
/// <param name="userId">The unique identifier of the user whose wishlist will be cleared.</param>
/// <returns>A result indicating whether the wishlist was successfully cleared.</returns>
Task<Result> ClearWishlistAsync(Guid userId);
}
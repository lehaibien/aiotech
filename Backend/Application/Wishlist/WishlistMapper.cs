using Application.Wishlist.Dtos;
using Domain.Entities;

namespace Application.Wishlist;

public static class WishlistMapper
{
    /// <summary>
    /// Projects a queryable collection of <see cref="WishlistItem"/> entities into <see cref="WishlistItemDto"/> objects, selecting key product details and pricing.
    /// </summary>
    /// <param name="query">The queryable collection of wishlist items to project.</param>
    /// <returns>A queryable collection of <see cref="WishlistItemDto"/> objects representing the wishlist items.</returns>
    public static IQueryable<WishlistItemDto> ProjectToDto(this IQueryable<WishlistItem> query)
    {
        return query.Select(w => new WishlistItemDto(
            w.Id,
            w.ProductId,
            w.Product.Name,
            w.Product.ImageUrls[0],
            w.Product.DiscountPrice ?? w.Product.Price
        ));
    }

    /// <summary>
    /// Maps a <see cref="WishlistItem"/> entity to a <see cref="WishlistItemDto"/>.
    /// </summary>
    /// <param name="wishlistItem">The wishlist item to map.</param>
    /// <returns>A <see cref="WishlistItemDto"/> containing the item's ID, product details, first image URL, and the discount or regular price.</returns>
    public static WishlistItemDto MapToDto(this WishlistItem wishlistItem)
    {
        return new WishlistItemDto(
            wishlistItem.Id,
            wishlistItem.ProductId,
            wishlistItem.Product.Name,
            wishlistItem.Product.ImageUrls[0],
            wishlistItem.Product.DiscountPrice ?? wishlistItem.Product.Price
        );
    }
}
using Application.Wishlist.Dtos;
using Domain.Entities;

namespace Application.Wishlist;

public static class WishlistMapper
{
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
using Application.Carts.Dtos;
using Domain.Entities;

namespace Application.Carts;

public static class CartMapper
{
    public static CartItemResponse MapToCartItemResponse(this CartItem cartItem)
    {
        return new CartItemResponse
        {
            ProductId = cartItem.ProductId,
            ProductName = cartItem.Product.Name,
            ProductImage = cartItem.Product.ImageUrls[0],
            ProductPrice = cartItem.Product.DiscountPrice ?? cartItem.Product.Price,
            Quantity = cartItem.Quantity,
        };
    }
    
    // Projection
    public static IQueryable<CartItemResponse> ProjectToCartItemResponse(this IQueryable<CartItem> query)
    {
        return query.Select(x => new CartItemResponse
        {
            ProductId = x.ProductId,
            ProductName = x.Product.Name,
            ProductImage = x.Product.ImageUrls[0],
            ProductPrice = x.Product.DiscountPrice ?? x.Product.Price,
            Quantity = x.Quantity,
        });
    }
}
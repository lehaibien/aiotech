using Application.Carts.Dtos;
using Domain.Entities;
using Shared;

namespace Application.Carts;

public interface ICartService
{
    Task<Result<List<CartItemResponse>>> GetCartByUserId(Guid userId);
    Task<Result<List<CartItemResponse>>> AddToCart(CartRequest request);
    Task<Result<List<CartItemResponse>>> RemoveFromCart(CartRemoveItemRequest request);
}
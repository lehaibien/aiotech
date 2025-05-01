using Application.Carts.Dtos;
using Domain.Entities;
using Application.Shared;

namespace Application.Carts;

public interface ICartService
{
    Task<Result<List<CartItemResponse>>> GetCartByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Result<List<CartItemResponse>>> AddToCartAsync(CartRequest request);
    Task<Result<List<CartItemResponse>>> RemoveFromCartAsync(CartRemoveItemRequest request);
}
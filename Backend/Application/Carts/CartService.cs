using Application.Carts.Dtos;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using Application.Shared;

namespace Application.Carts;

public class CartService : ICartService
{
    private readonly IUnitOfWork _unitOfWork;

    public CartService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<List<CartItemResponse>>> GetCartByUserIdAsync(Guid userId, CancellationToken cancellationToken = default)
    {
        var cart = await _unitOfWork
            .GetRepository<CartItem>()
            .GetAll(x => x.UserId == userId)
            .ProjectToCartItemResponse()
            .ToListAsync(cancellationToken);
        return Result<List<CartItemResponse>>.Success(cart);
    }

    public async Task<Result<List<CartItemResponse>>> AddToCartAsync(CartRequest request)
    {
        var cart = await _unitOfWork
            .GetRepository<CartItem>()
            .GetAll(x => x.UserId == request.UserId && x.ProductId == request.ProductId)
            .FirstOrDefaultAsync();
        if (cart is not null)
        {
            cart.Quantity = request.Quantity ?? cart.Quantity + 1;
            _unitOfWork.GetRepository<CartItem>().Update(cart);
        }
        else
        {
            var newCart = new CartItem
            {
                UserId = request.UserId,
                ProductId = request.ProductId,
                Quantity = 1,
            };
            _unitOfWork.GetRepository<CartItem>().Add(newCart);
        }

        await _unitOfWork.SaveChangesAsync();

        var cartList = await _unitOfWork
            .GetRepository<CartItem>()
            .GetAll(x => x.UserId == request.UserId)
            .Include(x => x.Product)
            .ProjectToCartItemResponse()
            .ToListAsync();

        return Result<List<CartItemResponse>>.Success(cartList);
    }

    public async Task<Result<List<CartItemResponse>>> RemoveFromCartAsync(CartRemoveItemRequest request)
    {
        var cart = await _unitOfWork
            .GetRepository<CartItem>()
            .GetAll(x => x.UserId == request.UserId && x.ProductId == request.ProductId)
            .FirstOrDefaultAsync();
        if (cart is null)
        {
            return Result<List<CartItemResponse>>.Failure("Giỏ hàng không tồn tại");
        }

        _unitOfWork.GetRepository<CartItem>().Delete(cart);
        await _unitOfWork.SaveChangesAsync();

        var cartList = await _unitOfWork
            .GetRepository<CartItem>()
            .GetAll(x => x.UserId == request.UserId)
            .Include(x => x.Product)
            .ProjectToCartItemResponse()
            .ToListAsync();
        return Result<List<CartItemResponse>>.Success(cartList);
    }
}

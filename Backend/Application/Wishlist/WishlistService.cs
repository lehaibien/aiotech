using Application.Wishlist.Dtos;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Application.Wishlist;

public class WishlistService : IWishlistService
{
    private readonly IUnitOfWork _unitOfWork;

    /// <summary>
    /// Initializes a new instance of the <see cref="WishlistService"/> with the specified unit of work for data access.
    /// </summary>
    public WishlistService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    /// <summary>
    /// Asynchronously retrieves all wishlist items for the specified user.
    /// </summary>
    /// <param name="userId">The unique identifier of the user whose wishlist is to be retrieved.</param>
    /// <returns>A result containing a list of wishlist item DTOs for the user.</returns>
    public async Task<Result<List<WishlistItemDto>>> GetWishlistAsync(Guid userId)
    {
        var response = await _unitOfWork.GetRepository<WishlistItem>()
            .GetAll(x => x.UserId == userId)
            .ProjectToDto()
            .ToListAsync();
        return Result<List<WishlistItemDto>>.Success(response);
    }
    /// <summary>
    /// Adds a product to the user's wishlist if it does not already exist.
    /// </summary>
    /// <param name="request">The wishlist item request containing user and product identifiers.</param>
    /// <returns>A result containing the added wishlist item DTO on success, or a failure result with an error message if the item already exists or cannot be added.</returns>
    public async Task<Result<WishlistItemDto>> AddItemToWishlistAsync(WishlistItemRequest request)
    {
        var existingItem = await _unitOfWork.GetRepository<WishlistItem>()
            .GetAll(x => x.UserId == request.UserId && x.ProductId == request.ProductId)
            .FirstOrDefaultAsync();
        if(existingItem is not null)
        {
            return Result<WishlistItemDto>.Failure("Sản phẩm đã có trong danh sách yêu thích");
        }
        var wishlistItem = new WishlistItem
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            ProductId = request.ProductId,
            CreatedAt = DateTime.UtcNow
        };
        _unitOfWork.GetRepository<WishlistItem>().Add(wishlistItem);
        await _unitOfWork.SaveChangesAsync();
        var entity = await _unitOfWork.GetRepository<WishlistItem>()
            .GetAll(x => x.Id == wishlistItem.Id)
            .ProjectToDto()
            .FirstOrDefaultAsync();
        if(entity == null)
        {
            return Result<WishlistItemDto>.Failure("Thêm sản phẩm vào danh sách yêu thích không thành công");
        }
        return Result<WishlistItemDto>.Success(entity);
    }
    /// <summary>
    /// Removes a specific product from a user's wishlist.
    /// </summary>
    /// <param name="request">The wishlist item request containing user and product identifiers.</param>
    /// <returns>A result indicating success if the item was removed, or failure if the item was not found in the wishlist.</returns>
    public async Task<Result> RemoveItemFromWishlistAsync(WishlistItemRequest request)
    {
        var wishlistItem = _unitOfWork.GetRepository<WishlistItem>()
            .GetAll(x => x.UserId == request.UserId && x.ProductId == request.ProductId)
            .FirstOrDefault();
        if(wishlistItem is null)
        {
            return Result.Failure("Sản phẩm không có trong danh sách yêu thích");
        }
        _unitOfWork.GetRepository<WishlistItem>().Delete(wishlistItem);
        await _unitOfWork.SaveChangesAsync();
        return Result.Success();
    }
    /// <summary>
    /// Removes all wishlist items for the specified user.
    /// </summary>
    /// <param name="userId">The unique identifier of the user whose wishlist will be cleared.</param>
    /// <returns>A result indicating the success of the operation.</returns>
    public async Task<Result> ClearWishlistAsync(Guid userId)
    {
        var wishlistItems = _unitOfWork.GetRepository<WishlistItem>()
            .GetAll(x => x.UserId == userId);
        _unitOfWork.GetRepository<WishlistItem>().DeleteRange(wishlistItems);
        await _unitOfWork.SaveChangesAsync();
        return Result.Success();
    }
}
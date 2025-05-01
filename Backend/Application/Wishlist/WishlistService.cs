using Application.Wishlist.Dtos;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using Application.Shared;

namespace Application.Wishlist;

public class WishlistService : IWishlistService
{
    private readonly IUnitOfWork _unitOfWork;

    public WishlistService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<List<WishlistItemDto>>> GetWishlistAsync(Guid userId)
    {
        var response = await _unitOfWork
            .GetRepository<WishlistItem>()
            .GetAll(x => x.UserId == userId)
            .ProjectToDto()
            .ToListAsync();
        return Result<List<WishlistItemDto>>.Success(response);
    }

    public async Task<Result<WishlistItemDto>> AddItemToWishlistAsync(WishlistItemRequest request)
    {
        var existingItem = await _unitOfWork
            .GetRepository<WishlistItem>()
            .GetAll(x => x.UserId == request.UserId && x.ProductId == request.ProductId)
            .FirstOrDefaultAsync();
        if (existingItem is not null)
        {
            return Result<WishlistItemDto>.Failure("Sản phẩm đã có trong danh sách yêu thích");
        }
        var wishlistItem = new WishlistItem
        {
            Id = Guid.NewGuid(),
            UserId = request.UserId,
            ProductId = request.ProductId,
            CreatedAt = DateTime.UtcNow,
        };
        _unitOfWork.GetRepository<WishlistItem>().Add(wishlistItem);
        await _unitOfWork.SaveChangesAsync();
        var entity = await _unitOfWork
            .GetRepository<WishlistItem>()
            .GetAll(x => x.Id == wishlistItem.Id)
            .ProjectToDto()
            .FirstOrDefaultAsync();
        if (entity == null)
        {
            return Result<WishlistItemDto>.Failure(
                "Thêm sản phẩm vào danh sách yêu thích không thành công"
            );
        }
        return Result<WishlistItemDto>.Success(entity);
    }

    public async Task<Result> RemoveItemFromWishlistAsync(WishlistItemRequest request)
    {
        var wishlistItem = _unitOfWork
            .GetRepository<WishlistItem>()
            .GetAll(x => x.UserId == request.UserId && x.ProductId == request.ProductId)
            .FirstOrDefault();
        if (wishlistItem is null)
        {
            return Result.Failure("Sản phẩm không có trong danh sách yêu thích");
        }
        _unitOfWork.GetRepository<WishlistItem>().Delete(wishlistItem);
        await _unitOfWork.SaveChangesAsync();
        return Result.Success();
    }

    public async Task<Result> ClearWishlistAsync(Guid userId)
    {
        var wishlistItems = _unitOfWork
            .GetRepository<WishlistItem>()
            .GetAll(x => x.UserId == userId);
        _unitOfWork.GetRepository<WishlistItem>().DeleteRange(wishlistItems);
        await _unitOfWork.SaveChangesAsync();
        return Result.Success();
    }
}

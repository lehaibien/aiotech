using System.Data;
using System.Linq.Expressions;
using Application.Helpers;
using Application.Reviews.Dtos;
using AutoMapper;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Application.Reviews;

public class ReviewService : IReviewService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _contextAccessor;

    public ReviewService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IHttpContextAccessor contextAccessor
    )
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _contextAccessor = contextAccessor;
    }

    public async Task<Result<PaginatedList>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var query = _unitOfWork.GetRepository<Review>().GetAll();
        if (!string.IsNullOrEmpty(request.TextSearch))
        {
            query = query.Where(x => x.User.UserName.Contains(request.TextSearch));
        }
        var sortCol = GetSortExpression(request.SortColumn);
        if (sortCol is null)
        {
            query = query
                .OrderByDescending(x => x.UpdatedDate)
                .ThenByDescending(x => x.CreatedDate);
        }
        else
        {
            if (request.SortOrder?.ToLower() == "desc")
            {
                query = query.OrderByDescending(sortCol);
            }
            else
            {
                query = query.OrderBy(sortCol);
            }
        }
        var totalRow = await query.CountAsync(cancellationToken);
        var result = await query
            .Skip(request.PageIndex * request.PageSize)
            .Take(request.PageSize)
            .Select(x => new ReviewResponse
            {
                Id = x.Id,
                UserName = x.User.UserName,
                ProductName = x.Product.Name,
                Rating = x.Rating,
                Comment = x.Comment,
                CreatedDate = x.CreatedDate,
                UpdatedDate = x.UpdatedDate,
            })
            .ToListAsync(cancellationToken);
        var response = new PaginatedList
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = totalRow,
            Items = result,
        };
        return Result<PaginatedList>.Success(response);
    }

    public async Task<Result<List<ReviewProductResponse>>> GetByProductId(
        GetListReviewByProductIdRequest request
    )
    {
        var result = await _unitOfWork
            .GetRepository<Review>()
            .GetAll(x => x.ProductId == request.ProductId)
            .Include(x => x.User)
            .Select(x => new ReviewProductResponse
            {
                Id = x.Id,
                UserName = x.User.UserName,
                UserImageUrl = x.User.AvatarUrl,
                Rating = x.Rating,
                Comment = x.Comment,
                CreatedDate = x.CreatedDate,
            })
            .OrderByDescending(x => x.UserName == _contextAccessor.HttpContext.User.Identity.Name)
            .Skip(request.PageSize * request.PageIndex)
            .Take(request.PageSize)
            .ToListAsync();
        return Result<List<ReviewProductResponse>>.Success(result);
    }

    public async Task<Result<ReviewResponse>> GetById(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Review>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result<ReviewResponse>.Failure("Đánh giá không tồn tại");
        }

        var response = _mapper.Map<ReviewResponse>(entity);
        return Result<ReviewResponse>.Success(response);
    }

    public async Task<Result<ReviewResponse>> Create(CreateReviewRequest request)
    {
        var isCommented = await _unitOfWork
            .GetRepository<Review>()
            .GetAll(x =>
                x.ProductId == request.ProductId
                && x.UserId == request.UserId
                && x.IsDeleted == false
            )
            .FirstOrDefaultAsync();
        if (isCommented != null)
        {
            return Result<ReviewResponse>.Failure("Bạn đã đánh giá sản phẩm này rồi");
        }
        var hasBought = await _unitOfWork
            .GetRepository<Order>()
            .GetAll(x =>
                x.IsDeleted == false
                && x.CustomerId == request.UserId
                && !x.IsDeleted
                && x.OrderItems.Any(y => y.ProductId == request.ProductId)
            )
            .AnyAsync();
        if (!hasBought)
        {
            return Result<ReviewResponse>.Failure("Bạn chưa mua sản phẩm này");
        }
        var entity = _mapper.Map<Review>(request);
        entity.CreatedDate = DateTime.UtcNow;
        entity.CreatedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        _unitOfWork.GetRepository<Review>().Add(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = _mapper.Map<ReviewResponse>(entity);
        return Result<ReviewResponse>.Success(response);
    }

    public async Task<Result<ReviewResponse>> Update(UpdateReviewRequest request)
    {
        var entity = await _unitOfWork.GetRepository<Review>().FindAsync(x => x.Id == request.Id);
        if (entity is null)
        {
            return Result<ReviewResponse>.Failure("Đánh giá không tồn tại");
        }
        _mapper.Map(request, entity);
        entity.UpdatedDate = DateTime.UtcNow;
        entity.UpdatedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        _unitOfWork.GetRepository<Review>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = _mapper.Map<ReviewResponse>(entity);
        return Result<ReviewResponse>.Success(response);
    }

    public async Task<Result> Delete(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Review>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result.Failure("Đánh giá không tồn tại");
        }
        entity.DeletedDate = DateTime.UtcNow;
        entity.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<Review>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        return Result.Success();
    }

    public async Task<Result<string>> DeleteList(List<Guid> ids)
    {
        foreach (var id in ids)
        {
            var entity = await _unitOfWork.GetRepository<Review>().GetByIdAsync(id);
            if (entity is null)
            {
                return Result<string>.Failure("Đánh giá không tồn tại");
            }
            entity.DeletedDate = DateTime.UtcNow;
            entity.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
            entity.IsDeleted = true;
            _unitOfWork.GetRepository<Review>().Update(entity);
        }
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success(ids.Count.ToString());
    }

    private static Expression<Func<Review, object>>? GetSortExpression(string? orderBy)
    {
        return orderBy?.ToLower() switch
        {
            "rating" => x => x.Rating,
            "createdDate" => x => x.CreatedDate,
            _ => x => x.CreatedDate,
        };
    }
}

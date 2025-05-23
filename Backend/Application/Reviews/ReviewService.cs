﻿using System.Linq.Expressions;
using Application.Helpers;
using Application.Reviews.Dtos;
using Application.Shared;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Application.Reviews;

public class ReviewService : IReviewService
{
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IUnitOfWork _unitOfWork;

    public ReviewService(IUnitOfWork unitOfWork, IHttpContextAccessor contextAccessor)
    {
        _unitOfWork = unitOfWork;
        _contextAccessor = contextAccessor;
    }

    public async Task<Result<PaginatedList<ReviewResponse>>> GetListAsync(
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

        var dtoQuery = query.ProjectToReviewResponse();
        var result = await PaginatedList<ReviewResponse>.CreateAsync(
            dtoQuery,
            request.PageIndex,
            request.PageSize,
            cancellationToken
        );
        return Result<PaginatedList<ReviewResponse>>.Success(result);
    }

    public async Task<Result<List<ReviewProductResponse>>> GetByProductIdAsync(
        GetListReviewByProductIdRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var userId = _contextAccessor
            .HttpContext.User.Claims.FirstOrDefault(x => x.Type == "nameid")
            ?.Value;
        var result = await _unitOfWork
            .GetRepository<Review>()
            .GetAll(x => x.ProductId == request.ProductId)
            .Include(x => x.User)
            .OrderByDescending(x => userId != null && x.UserId == Guid.Parse(userId))
            .ThenByDescending(x => x.Rating)
            .ProjectToReviewProductResponse()
            .Skip(request.PageSize * request.PageIndex)
            .Take(request.PageSize)
            .ToListAsync(cancellationToken);
        return Result<List<ReviewProductResponse>>.Success(result);
    }

    public async Task<Result<ReviewResponse>> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default
    )
    {
        var entity = await _unitOfWork.GetRepository<Review>().GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return Result<ReviewResponse>.Failure("Đánh giá không tồn tại");
        }

        var response = entity.MapToReviewResponse();
        return Result<ReviewResponse>.Success(response);
    }

    public async Task<Result<ReviewResponse>> CreateAsync(ReviewRequest request)
    {
        var isCommented = await _unitOfWork
            .GetRepository<Review>()
            .GetAll(x => x.ProductId == request.ProductId && x.UserId == request.UserId)
            .AnyAsync();
        if (isCommented)
        {
            return Result<ReviewResponse>.Failure("Bạn đã đánh giá sản phẩm này rồi");
        }

        var hasBought = await _unitOfWork
            .GetRepository<Order>()
            .GetAll(x =>
                x.CustomerId == request.UserId
                && x.OrderItems.Any(y => y.ProductId == request.ProductId)
            )
            .AnyAsync();
        if (!hasBought)
        {
            return Result<ReviewResponse>.Failure("Bạn chưa mua sản phẩm này");
        }

        var entity = request.MapToReview();
        _unitOfWork.GetRepository<Review>().Add(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = await _unitOfWork
            .GetRepository<Review>()
            .GetAll(x => x.Id == entity.Id)
            .ProjectToReviewResponse()
            .FirstOrDefaultAsync();
        return Result<ReviewResponse>.Success(response);
    }

    public async Task<Result<ReviewResponse>> UpdateAsync(ReviewRequest request)
    {
        if (request.Id == Guid.Empty)
        {
            return Result<ReviewResponse>.Failure("Đánh giá không tồn tại");
        }

        var entity = await _unitOfWork.GetRepository<Review>().FindAsync(x => x.Id == request.Id);
        if (entity is null)
        {
            return Result<ReviewResponse>.Failure("Đánh giá không tồn tại");
        }

        entity = request.ApplyToReview(entity);
        entity.UpdatedDate = DateTime.UtcNow;
        entity.UpdatedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        _unitOfWork.GetRepository<Review>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = await _unitOfWork
            .GetRepository<Review>()
            .GetAll(x => x.Id == entity.Id)
            .ProjectToReviewResponse()
            .FirstOrDefaultAsync();
        return Result<ReviewResponse>.Success(response);
    }

    public async Task<Result> DeleteAsync(Guid id)
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

    public async Task<Result> DeleteListAsync(List<Guid> ids)
    {
        foreach (var id in ids)
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
        }

        await _unitOfWork.SaveChangesAsync();
        return Result.Success();
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

using System.Data;
using Application.Reviews.Dtos;
using AutoDependencyRegistration.Attributes;
using AutoMapper;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Application.Reviews;

[RegisterClassAsScoped]
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

    public async Task<Result<PaginatedList>> GetList(GetListRequest request)
    {
        SqlParameter totalRow = new()
        {
            ParameterName = "@oTotalRow",
            SqlDbType = SqlDbType.BigInt,
            Direction = ParameterDirection.Output,
        };
        var parameters = new SqlParameter[]
        {
            new("@iTextSearch", request.TextSearch),
            new("@iPageIndex", request.PageIndex),
            new("@iPageSize", request.PageSize),
            totalRow,
        };
        var result = await _unitOfWork
            .GetRepository<ReviewResponse>()
            .ExecuteStoredProcedureAsync(StoredProcedure.GetListReview, parameters);
        var response = new PaginatedList
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = Convert.ToInt32(totalRow.Value),
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
        // var isExists = await _unitOfWork.GetRepository<Domain.Entities.Review>()
        //     .FindAsync();
        // if (isExists != null)
        // {
        //     return Result<ReviewResponse>.Failure("Đánh giá đã tồn tại");
        // }
        var entity = _mapper.Map<Review>(request);
        entity.CreatedDate = DateTime.Now;
        entity.CreatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        _unitOfWork.GetRepository<Review>().Add(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = _mapper.Map<ReviewResponse>(entity);
        return Result<ReviewResponse>.Success(response);
    }

    public async Task<Result<ReviewResponse>> Update(UpdateReviewRequest request)
    {
        var isExists = await _unitOfWork.GetRepository<Review>().AnyAsync(x => x.Id != request.Id);
        if (isExists)
        {
            return Result<ReviewResponse>.Failure("Đánh giá đã tồn tại");
        }
        var entity = await _unitOfWork.GetRepository<Review>().FindAsync(x => x.Id == request.Id);
        if (entity is null)
        {
            return Result<ReviewResponse>.Failure("Đánh giá không tồn tại");
        }
        _mapper.Map(request, entity);
        entity.UpdatedDate = DateTime.Now;
        entity.UpdatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        _unitOfWork.GetRepository<Review>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = _mapper.Map<ReviewResponse>(entity);
        return Result<ReviewResponse>.Success(response);
    }

    public async Task<Result<string>> Delete(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Review>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result<string>.Failure("Đánh giá không tồn tại");
        }
        entity.DeletedDate = DateTime.Now;
        entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<Review>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
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
            entity.DeletedDate = DateTime.Now;
            entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
            entity.IsDeleted = true;
            _unitOfWork.GetRepository<Review>().Update(entity);
        }
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }
}

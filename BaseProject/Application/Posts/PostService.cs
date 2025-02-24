using System.Data;
using Application.Images;
using Application.Posts.Dtos;
using AutoDependencyRegistration.Attributes;
using AutoMapper;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Application.Posts;

[RegisterClassAsScoped]
public class PostService : IPostService
{
    private const string FolderUpload = "posts";
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IImageService _imageService;

    public PostService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IHttpContextAccessor contextAccessor,
        IImageService imageService
    )
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _contextAccessor = contextAccessor;
        _imageService = imageService;
    }

    public async Task<Result<PaginatedList>> GetListAsync(GetListRequest request)
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
            .GetRepository<PostResponse>()
            .ExecuteStoredProcedureAsync(StoredProcedure.GetListPost, parameters);
        var response = new PaginatedList
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = Convert.ToInt32(totalRow.Value),
            Items = result,
        };
        return Result<PaginatedList>.Success(response);
    }

    public async Task<Result<List<PostPreviewResponse>>> GetPostPreviewAsync(GetListRequest request)
    {
        var entities = await _unitOfWork
            .GetRepository<Post>()
            .GetAll(x => x.IsPublished == true)
            .Skip(request.PageIndex * request.PageSize)
            .Take(request.PageSize)
            .Select(x => new PostPreviewResponse
            {
                Id = x.Id,
                Title = x.Title,
                ImageUrl = x.ImageUrl,
                CreatedDate = x.CreatedDate,
            })
            .ToListAsync();
        return Result<List<PostPreviewResponse>>.Success(entities);
    }

    public async Task<Result<PostResponse>> GetByIdAsync(Guid id)
    {
        var entity = await _unitOfWork
            .GetRepository<Post>()
            .GetAll()
            .Select(x => new PostResponse
            {
                Id = x.Id,
                Title = x.Title,
                Content = x.Content,
                ImageUrl = x.ImageUrl,
                CreatedDate = x.CreatedDate,
                Tags = x.Tags,
                IsPublished = x.IsPublished,
            })
            .FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null)
        {
            return Result<PostResponse>.Failure("Bài viết không tồn tại");
        }

        return Result<PostResponse>.Success(entity);
    }

    public async Task<Result<PostResponse>> CreateAsync(CreatePostRequest request)
    {
        var isExists = await _unitOfWork
            .GetRepository<Post>()
            .FindAsync(x => x.Title == request.Title);
        if (isExists != null)
        {
            return Result<PostResponse>.Failure("Bài viết đã tồn tại");
        }

        var entity = _mapper.Map<Post>(request);
        entity.Id = Guid.NewGuid();
        entity.CreatedDate = DateTime.Now;
        entity.CreatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        var uploadResult = await _imageService.UploadAsync(
            request.Image,
            Path.Combine(FolderUpload, entity.Id.ToString())
        );
        if (uploadResult.IsFailure)
        {
            return Result<PostResponse>.Failure(uploadResult.Message);
        }

        entity.ImageUrl = uploadResult.Data;
        _unitOfWork.GetRepository<Post>().Add(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = _mapper.Map<PostResponse>(entity);
        return Result<PostResponse>.Success(response);
    }

    public async Task<Result<PostResponse>> UpdateAsync(UpdatePostRequest request)
    {
        var isExists = await _unitOfWork
            .GetRepository<Post>()
            .AnyAsync(x => x.Title == request.Title && x.Id != request.Id);
        if (isExists)
        {
            return Result<PostResponse>.Failure("Bài viết đã tồn tại");
        }

        var entity = await _unitOfWork.GetRepository<Post>().FindAsync(x => x.Id == request.Id);
        if (entity is null)
        {
            return Result<PostResponse>.Failure("Bài viết không tồn tại");
        }

        _mapper.Map(request, entity);
        entity.UpdatedDate = DateTime.Now;
        entity.UpdatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        var deleteResult = await _imageService.Delete(entity.ImageUrl);
        if (deleteResult.IsFailure)
        {
            return Result<PostResponse>.Failure(deleteResult.Message);
        }

        var uploadResult = await _imageService.UploadAsync(
            request.Image,
            Path.Combine(FolderUpload, entity.Id.ToString())
        );
        if (uploadResult.IsFailure)
        {
            return Result<PostResponse>.Failure(uploadResult.Message);
        }

        entity.ImageUrl = uploadResult.Data;
        _unitOfWork.GetRepository<Post>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = _mapper.Map<PostResponse>(entity);
        return Result<PostResponse>.Success(response);
    }

    public async Task<Result<string>> DeleteAsync(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Post>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result<string>.Failure("Bài viết không tồn tại");
        }

        entity.DeletedDate = DateTime.Now;
        entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<Post>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    public async Task<Result<string>> DeleteListAsync(List<Guid> ids)
    {
        foreach (var id in ids)
        {
            var entity = await _unitOfWork.GetRepository<Post>().GetByIdAsync(id);
            if (entity is null)
            {
                return Result<string>.Failure("Bài viết không tồn tại");
            }

            entity.DeletedDate = DateTime.Now;
            entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
            entity.IsDeleted = true;
            _unitOfWork.GetRepository<Post>().Update(entity);
        }

        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }
}

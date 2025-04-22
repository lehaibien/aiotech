using System.Data;
using System.Linq.Expressions;
using Application.Images;
using Application.Posts.Dtos;
using AutoMapper;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Application.Posts;

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

    public async Task<Result<PaginatedList>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var postQuery = _unitOfWork.GetRepository<Post>().GetAll();
        if (!string.IsNullOrEmpty(request.TextSearch))
        {
            postQuery = postQuery.Where(x =>
                x.Title.ToLower().Contains(request.TextSearch.ToLower())
            );
        }
        var sortCol = GetSortExpression(request.SortColumn);
        if (sortCol is null)
        {
            postQuery = postQuery
                .OrderByDescending(x => x.UpdatedDate)
                .ThenByDescending(x => x.CreatedDate);
        }
        else
        {
            if (request.SortOrder?.ToLower() == "desc")
            {
                postQuery = postQuery.OrderByDescending(sortCol);
            }
            else
            {
                postQuery = postQuery.OrderBy(sortCol);
            }
        }
        var totalRow = await postQuery.CountAsync(cancellationToken);
        var result = await postQuery
            .Skip(request.PageIndex * request.PageSize)
            .Take(request.PageSize)
            .Select(x => new PostResponse
            {
                Id = x.Id,
                Title = x.Title,
                Content = x.Content,
                Tags = x.Tags,
                IsPublished = x.IsPublished,
                ImageUrl = x.ImageUrl,
                CreatedDate = x.CreatedDate,
                CreatedBy = x.CreatedBy,
                UpdatedDate = x.UpdatedDate,
                UpdatedBy = x.UpdatedBy,
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

    public async Task<Result<PaginatedList>> GetPostPreviewAsync(GetListRequest request)
    {
        var entities = await _unitOfWork
            .GetRepository<Post>()
            .GetAll(x => x.IsPublished && x.Title.Contains(request.TextSearch))
            .OrderByDescending(x => x.CreatedDate)
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
        var count = await _unitOfWork
            .GetRepository<Post>()
            .CountAsync(x => x.IsPublished && x.Title.Contains(request.TextSearch));
        var response = new PaginatedList
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = count,
            Items = entities,
        };
        return Result<PaginatedList>.Success(response);
    }

    public async Task<Result<List<PostResponse>>> GetRelatedPostAsync(Guid id)
    {
        var entities = await _unitOfWork
            .GetRepository<Post>()
            .GetAll(x => x.IsPublished && x.Id != id)
            .OrderByDescending(x => x.CreatedDate)
            .Take(5)
            .Select(x => new PostResponse
            {
                Id = x.Id,
                Title = x.Title,
                ImageUrl = x.ImageUrl,
                CreatedDate = x.CreatedDate,
            })
            .ToListAsync();
        return Result<List<PostResponse>>.Success(entities);
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
        entity.CreatedDate = DateTime.UtcNow;
        entity.CreatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        var uploadResult = await _imageService.UploadAsync(
            request.Image,
            ImageType.Blog,
            Path.Combine(FolderUpload, entity.Id.ToString())
        );
        if (uploadResult.IsFailure)
        {
            return Result<PostResponse>.Failure(uploadResult.Message);
        }

        entity.ImageUrl = uploadResult.Value;
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
        entity.UpdatedDate = DateTime.UtcNow;
        entity.UpdatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        var deleteResult = _imageService.DeleteByUrl(entity.ImageUrl);
        if (deleteResult.IsFailure)
        {
            return Result<PostResponse>.Failure(deleteResult.Message);
        }

        var uploadResult = await _imageService.UploadAsync(
            request.Image,
            ImageType.Blog,
            Path.Combine(FolderUpload, entity.Id.ToString())
        );
        if (uploadResult.IsFailure)
        {
            return Result<PostResponse>.Failure(uploadResult.Message);
        }

        entity.ImageUrl = uploadResult.Value;
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

        entity.DeletedDate = DateTime.UtcNow;
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

            entity.DeletedDate = DateTime.UtcNow;
            entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
            entity.IsDeleted = true;
            _unitOfWork.GetRepository<Post>().Update(entity);
        }

        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    private static Expression<Func<Post, object>>? GetSortExpression(string? orderBy)
    {
        return orderBy?.ToLower() switch
        {
            "name" => x => x.Title,
            "isPublished" => x => x.IsPublished,
            "createdDate" => x => x.CreatedDate,
            "updatedDate" => x => x.UpdatedDate,
            _ => null,
        };
    }
}

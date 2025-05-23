using System.Linq.Expressions;
using Application.Abstractions;
using Application.Helpers;
using Application.Images;
using Application.Posts.Dtos;
using Application.Shared;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Application.Posts;

public class PostService : IPostService
{
    private const string FolderUpload = "images/posts";
    private const string ThumbnailPrefix = "thumbnail";
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IImageService _imageService;
    private readonly IStorageService _storageService;

    public PostService(
        IUnitOfWork unitOfWork,
        IHttpContextAccessor contextAccessor,
        IImageService imageService,
        IStorageService storageService
    )
    {
        _unitOfWork = unitOfWork;
        _contextAccessor = contextAccessor;
        _imageService = imageService;
        _storageService = storageService;
    }

    public async Task<Result<PaginatedList<PostResponse>>> GetListAsync(
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
        var dtoQuery = postQuery.ProjectToPostResponse();
        var result = await PaginatedList<PostResponse>.CreateAsync(
            dtoQuery,
            request.PageIndex,
            request.PageSize,
            cancellationToken
        );
        return Result<PaginatedList<PostResponse>>.Success(result);
    }

    public async Task<Result<PaginatedList<PostListItemResponse>>> GetListItemAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var query = _unitOfWork
            .GetRepository<Post>()
            .GetAll(x => x.IsPublished && x.Title.Contains(request.TextSearch));

        if (!string.IsNullOrEmpty(request.TextSearch))
        {
            query = query.Where(x => x.Title.ToLower().Contains(request.TextSearch.ToLower()));
        }

        var dtoQuery = query.OrderByDescending(x => x.CreatedDate).ProjectToPostListItemResponse();

        var result = await PaginatedList<PostListItemResponse>.CreateAsync(
            dtoQuery,
            request.PageIndex,
            request.PageSize,
            cancellationToken
        );
        return Result<PaginatedList<PostListItemResponse>>.Success(result);
    }

    public async Task<Result<List<PostListItemResponse>>> GetRelatedPostAsync(
        Guid id,
        CancellationToken cancellationToken = default
    )
    {
        var result = await _unitOfWork
            .GetRepository<Post>()
            .GetAll(x => x.IsPublished && x.Id != id)
            .OrderByDescending(x => x.CreatedDate)
            .ProjectToPostListItemResponse()
            .Take(6)
            .ToListAsync(cancellationToken);
        return Result<List<PostListItemResponse>>.Success(result);
    }

    public async Task<Result<PostDetailResponse>> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default
    )
    {
        var result = await _unitOfWork
            .GetRepository<Post>()
            .GetAll(x => x.Id == id)
            .ProjectToPostDetailResponse()
            .FirstOrDefaultAsync(cancellationToken);
        if (result is null)
        {
            return Result<PostDetailResponse>.Failure("Bài viết không tồn tại");
        }

        return Result<PostDetailResponse>.Success(result);
    }

    public async Task<Result<PostDetailResponse>> GetBySlugAsync(
        string slug,
        CancellationToken cancellationToken = default
    )
    {
        var result = await _unitOfWork
            .GetRepository<Post>()
            .GetAll(x => x.Slug == slug)
            .ProjectToPostDetailResponse()
            .FirstOrDefaultAsync(cancellationToken);
        if (result is null)
        {
            return Result<PostDetailResponse>.Failure("Bài viết không tồn tại");
        }
        return Result<PostDetailResponse>.Success(result);
    }

    public async Task<Result<PostUpdateResponse>> GetForUpdateAsync(Guid id)
    {
        var result = await _unitOfWork
            .GetRepository<Post>()
            .GetAll(x => x.Id == id)
            .ProjectToPostUpdateResponse()
            .FirstOrDefaultAsync();
        if (result is null)
        {
            return Result<PostUpdateResponse>.Failure("Bài viết không tồn tại");
        }
        return Result<PostUpdateResponse>.Success(result);
    }

    public async Task<Result<PostResponse>> CreateAsync(PostRequest request)
    {
        var isExists = await _unitOfWork
            .GetRepository<Post>()
            .FindAsync(x => x.Title == request.Title, false);
        if (isExists != null)
        {
            return Result<PostResponse>.Failure("Bài viết đã tồn tại");
        }

        var entity = request.MapToPost();
        entity.Id = Guid.NewGuid();
        entity.CreatedDate = DateTime.UtcNow;
        entity.CreatedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        var optimizedImage = await _imageService.OptimizeAsync(request.Image, ImageType.Blog);
        var thumbnailImage = await _imageService.OptimizeAsync(
            request.Image,
            ImageType.BlogThumbnail,
            ThumbnailPrefix
        );
        if (optimizedImage.IsFailure)
        {
            return Result<PostResponse>.Failure(optimizedImage.Message);
        }
        if (thumbnailImage.IsFailure)
        {
            return Result<PostResponse>.Failure(thumbnailImage.Message);
        }
        var uploadResult = await _storageService.UploadBulkAsync(
            [thumbnailImage.Value, optimizedImage.Value],
            CommonConst.PublicBucket,
            Path.Combine(FolderUpload, entity.Id.ToString())
        );
        var value = uploadResult.ToList();
        entity.ThumbnailUrl = value[0].Url;
        entity.ImageUrl = value[1].Url;
        _unitOfWork.GetRepository<Post>().Add(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = entity.MapToPostResponse();
        return Result<PostResponse>.Success(response);
    }

    public async Task<Result<PostResponse>> UpdateAsync(PostRequest request)
    {
        if (request.Id == Guid.Empty)
        {
            return Result<PostResponse>.Failure("Bài viết không tồn tại");
        }
        var isExists = await _unitOfWork
            .GetRepository<Post>()
            .AnyAsync(x => x.Title == request.Title && x.Id != request.Id);
        if (isExists)
        {
            return Result<PostResponse>.Failure("Bài viết đã tồn tại");
        }

        var entity = await _unitOfWork
            .GetRepository<Post>()
            .FindAsync(x => x.Id == request.Id, false);
        if (entity is null)
        {
            return Result<PostResponse>.Failure("Bài viết không tồn tại");
        }

        entity = request.ApplyToPost(entity);
        entity.UpdatedDate = DateTime.UtcNow;
        entity.UpdatedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        if (request.IsImageEdited)
        {
            await _storageService.DeleteFromUrlAsync(entity.ImageUrl);
            await _storageService.DeleteFromUrlAsync(entity.ThumbnailUrl);
            var thumbnailImage = await _imageService.OptimizeAsync(
                request.Image,
                ImageType.BlogThumbnail,
                ThumbnailPrefix
            );
            if (thumbnailImage.IsFailure)
            {
                return Result<PostResponse>.Failure(thumbnailImage.Message);
            }

            var optimizedImage = await _imageService.OptimizeAsync(request.Image, ImageType.Blog);
            if (optimizedImage.IsFailure)
            {
                return Result<PostResponse>.Failure(optimizedImage.Message);
            }

            var uploadResult = await _storageService.UploadBulkAsync(
                [thumbnailImage.Value, optimizedImage.Value],
                CommonConst.PublicBucket,
                Path.Combine(FolderUpload, entity.Id.ToString())
            );
            var value = uploadResult.ToList();
            entity.ThumbnailUrl = value[0].Url;
            entity.ImageUrl = value[1].Url;
        }
        _unitOfWork.GetRepository<Post>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = entity.MapToPostResponse();
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
        entity.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<Post>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    public async Task<Result<string>> DeleteListAsync(List<Guid> ids)
    {
        var entites = _unitOfWork.GetRepository<Post>().GetAll(x => ids.Contains(x.Id));
        await entites.ForEachAsync(x =>
        {
            x.DeletedDate = DateTime.UtcNow;
            x.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
            x.IsDeleted = true;
            _unitOfWork.GetRepository<Post>().Update(x);
        });

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

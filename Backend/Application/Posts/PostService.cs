using System.Data;
using System.Linq.Expressions;
using Application.Abstractions;
using Application.Helpers;
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
    private const string FolderUpload = "images/posts";
    private const string ThumbnailPrefix = "thumbnail";
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IImageService _imageService;
    private readonly IStorageService _storageService;

    /// <summary>
    /// Initializes a new instance of the <see cref="PostService"/> class with required dependencies for data access, HTTP context, image processing, and storage.
    /// </summary>
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

    /// <summary>
    /// Retrieves a paginated list of blog posts with optional text search and sorting.
    /// </summary>
    /// <param name="request">Pagination, search, and sorting parameters for the post list.</param>
    /// <param name="cancellationToken">Token to cancel the asynchronous operation.</param>
    /// <returns>A result containing a paginated list of post list items.</returns>
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
            .ProjectToPostListItemResponse()
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

    /// <summary>
    /// Retrieves a paginated list of published post summaries filtered by title.
    /// </summary>
    /// <param name="request">Pagination and search criteria for retrieving posts.</param>
    /// <param name="cancellationToken">Token to cancel the asynchronous operation.</param>
    /// <returns>A result containing a paginated list of post list item responses.</returns>
    public async Task<Result<PaginatedList>> GetListItemAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var query = _unitOfWork
            .GetRepository<Post>()
            .GetAll(x => x.IsPublished && x.Title.Contains(request.TextSearch));
        var entities = await query
            .OrderByDescending(x => x.CreatedDate)
            .Skip(request.PageIndex * request.PageSize)
            .Take(request.PageSize)
            .ProjectToPostListItemResponse()
            .ToListAsync(cancellationToken);
        var count = await query.CountAsync(cancellationToken);
        var response = new PaginatedList
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = count,
            Items = entities,
        };
        return Result<PaginatedList>.Success(response);
    }

    /// <summary>
    /// Retrieves up to five published posts, excluding the specified post, ordered by most recent creation date.
    /// </summary>
    /// <param name="id">The ID of the post to exclude from the results.</param>
    /// <param name="cancellationToken">Token to cancel the asynchronous operation.</param>
    /// <returns>A result containing a list of related post list item responses.</returns>
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
            .Take(5)
            .ToListAsync(cancellationToken);
        return Result<List<PostListItemResponse>>.Success(result);
    }

    /// <summary>
    /// Retrieves detailed information for a post by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the post.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>A result containing the post details if found; otherwise, a failure result.</returns>
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

    /// <summary>
    /// Retrieves detailed information for a post identified by its slug.
    /// </summary>
    /// <param name="slug">The unique slug of the post.</param>
    /// <param name="cancellationToken">Token to cancel the asynchronous operation.</param>
    /// <returns>A result containing the post details if found; otherwise, a failure result.</returns>
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

    /// <summary>
    /// Creates a new blog post with image optimization and storage, ensuring the title is unique.
    /// </summary>
    /// <param name="request">The post data to create.</param>
    /// <param name="cancellationToken">Token to cancel the asynchronous operation.</param>
    /// <returns>A result containing the created post response if successful; otherwise, a failure message.</returns>
    public async Task<Result<PostResponse>> CreateAsync(
        PostRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var isExists = await _unitOfWork
            .GetRepository<Post>()
            .FindAsync(x => x.Title == request.Title, false, cancellationToken);
        if (isExists != null)
        {
            return Result<PostResponse>.Failure("Bài viết đã tồn tại");
        }

        var entity = request.MapToPost();
        entity.Id = Guid.NewGuid();
        entity.CreatedDate = DateTime.UtcNow;
        entity.CreatedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        var optimizedImage = await _imageService.OptimizeAsync(
            request.Image,
            ImageType.Blog,
            cancellationToken: cancellationToken
        );
        var thumbnailImage = await _imageService.OptimizeAsync(
            request.Image,
            ImageType.BlogThumbnail,
            ThumbnailPrefix,
            cancellationToken
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
            Path.Combine(FolderUpload, entity.Id.ToString()),
            cancellationToken: cancellationToken
        );
        var value = uploadResult.ToList();
        entity.ThumbnailUrl = value[0].Url;
        entity.ImageUrl = value[1].Url;
        _unitOfWork.GetRepository<Post>().Add(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        var response = entity.MapToPostResponse();
        return Result<PostResponse>.Success(response);
    }

    /// <summary>
    /// Updates an existing blog post with new data, including optional image replacement and metadata updates.
    /// </summary>
    /// <param name="request">The post data to update, including content and image information.</param>
    /// <param name="cancellationToken">Token to cancel the asynchronous operation.</param>
    /// <returns>A result containing the updated post response if successful, or a failure message if the update could not be completed.</returns>
    public async Task<Result<PostResponse>> UpdateAsync(
        PostRequest request,
        CancellationToken cancellationToken = default
    )
    {
        if (request.Id == Guid.Empty)
        {
            return Result<PostResponse>.Failure("Bài viết không tồn tại");
        }
        var isExists = await _unitOfWork
            .GetRepository<Post>()
            .AnyAsync(x => x.Title == request.Title && x.Id != request.Id, cancellationToken);
        if (isExists)
        {
            return Result<PostResponse>.Failure("Bài viết đã tồn tại");
        }

        var entity = await _unitOfWork
            .GetRepository<Post>()
            .FindAsync(x => x.Id == request.Id, false, cancellationToken);
        if (entity is null)
        {
            return Result<PostResponse>.Failure("Bài viết không tồn tại");
        }

        entity = request.ApplyToPost(entity);
        entity.UpdatedDate = DateTime.UtcNow;
        entity.UpdatedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        if (request.IsImageEdited)
        {
            await _storageService.DeleteFromUrlAsync(entity.ImageUrl, cancellationToken);
            await _storageService.DeleteFromUrlAsync(entity.ThumbnailUrl, cancellationToken);
            var thumbnailImage = await _imageService.OptimizeAsync(
                request.Image,
                ImageType.BlogThumbnail,
                ThumbnailPrefix,
                cancellationToken
            );
            if (thumbnailImage.IsFailure)
            {
                return Result<PostResponse>.Failure(thumbnailImage.Message);
            }

            var optimizedImage = await _imageService.OptimizeAsync(
                request.Image,
                ImageType.Blog,
                cancellationToken: cancellationToken
            );
            if (optimizedImage.IsFailure)
            {
                return Result<PostResponse>.Failure(optimizedImage.Message);
            }

            var uploadResult = await _storageService.UploadBulkAsync(
                [thumbnailImage.Value, optimizedImage.Value],
                CommonConst.PublicBucket,
                Path.Combine(FolderUpload, entity.Id.ToString()),
                cancellationToken: cancellationToken
            );
            var value = uploadResult.ToList();
            entity.ThumbnailUrl = value[0].Url;
            entity.ImageUrl = value[1].Url;
        }
        _unitOfWork.GetRepository<Post>().Update(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        var response = entity.MapToPostResponse();
        return Result<PostResponse>.Success(response);
    }

    /// <summary>
    /// Marks a post as deleted by its ID, setting deletion metadata and flag.
    /// </summary>
    /// <param name="id">The unique identifier of the post to delete.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>A result indicating success or failure with a message.</returns>
    public async Task<Result<string>> DeleteAsync(
        Guid id,
        CancellationToken cancellationToken = default
    )
    {
        var entity = await _unitOfWork.GetRepository<Post>().GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return Result<string>.Failure("Bài viết không tồn tại");
        }

        entity.DeletedDate = DateTime.UtcNow;
        entity.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<Post>().Update(entity);
        await _unitOfWork.SaveChangesAsync(cancellationToken);
        return Result<string>.Success("Xóa thành công");
    }

    /// <summary>
    /// Marks multiple posts as deleted by setting deletion metadata and flag for each specified post ID.
    /// </summary>
    /// <param name="ids">List of post IDs to be marked as deleted.</param>
    /// <returns>A result indicating success with a confirmation message.</returns>
    public async Task<Result<string>> DeleteListAsync(
        List<Guid> ids,
        CancellationToken cancellationToken = default
    )
    {
        var entites = _unitOfWork.GetRepository<Post>().GetAll(x => ids.Contains(x.Id));
        await entites.ForEachAsync(
            x =>
            {
                x.DeletedDate = DateTime.UtcNow;
                x.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
                x.IsDeleted = true;
                _unitOfWork.GetRepository<Post>().Update(x);
            },
            cancellationToken: cancellationToken
        );

        await _unitOfWork.SaveChangesAsync(cancellationToken);
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

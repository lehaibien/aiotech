using System.Data;
using System.Linq.Expressions;
using Application.Abstractions;
using Application.Categories.Dtos;
using Application.Helpers;
using Application.Images;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Shared;

namespace Application.Categories;

public class CategoryService : ICategoryService
{
    private const string FolderUpload = "images/categories";
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IImageService _imageService;
    private readonly IStorageService _storageService;
    private readonly ICacheService _cacheService;
    private readonly ILogger<CategoryService> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="CategoryService"/> class with required dependencies for category management.
    /// </summary>
    public CategoryService(
        IUnitOfWork unitOfWork,
        IHttpContextAccessor contextAccessor,
        IImageService imageService,
        IStorageService storageService,
        ICacheService cacheService,
        ILogger<CategoryService> logger
    )
    {
        _unitOfWork = unitOfWork;
        _contextAccessor = contextAccessor;
        _imageService = imageService;
        _storageService = storageService;
        _cacheService = cacheService;
        _logger = logger;
    }

    /// <summary>
    /// Retrieves a paginated and optionally filtered list of categories, supporting text search and sorting.
    /// </summary>
    /// <param name="request">Pagination, search, and sorting parameters for the category list.</param>
    /// <param name="cancellationToken">Token to cancel the asynchronous operation.</param>
    /// <returns>A result containing a paginated list of category responses.</returns>
    public async Task<Result<PaginatedList>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var categoryQuery = _unitOfWork.GetRepository<Category>().GetAll();
        if (!string.IsNullOrEmpty(request.TextSearch))
        {
            categoryQuery = categoryQuery.Where(x =>
                x.Name.ToLower().Contains(request.TextSearch.ToLower())
            );
        }
        var sortCol = GetSortExpression(request.SortColumn);
        if (sortCol is null)
        {
            categoryQuery = categoryQuery
                .OrderByDescending(x => x.UpdatedDate)
                .ThenByDescending(x => x.CreatedDate);
        }
        else
        {
            if (request.SortOrder?.ToLower() == "desc")
            {
                categoryQuery = categoryQuery.OrderByDescending(sortCol);
            }
            else
            {
                categoryQuery = categoryQuery.OrderBy(sortCol);
            }
        }
        var totalRow = await categoryQuery.CountAsync(cancellationToken);
        var result = await categoryQuery
            .Skip(request.PageIndex * request.PageSize)
            .Take(request.PageSize)
            .ProjectToCategoryResponse()
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
    /// Retrieves a list of featured categories, using cached data if available.
    /// </summary>
    /// <returns>A result containing the list of featured category responses.</returns>
    public async Task<Result<List<CategoryResponse>>> GetFeaturedAsync()
    {
        var cacheResult = await _cacheService.GetAsync<List<CategoryResponse>>(
            CacheKeys.FeaturedCategories
        );
        if (cacheResult is not null)
        {
            return Result<List<CategoryResponse>>.Success(cacheResult);
        }
        var result = await _unitOfWork
            .GetRepository<Category>()
            .GetAll()
            .ProjectToCategoryResponse()
            .OrderByDescending(x => x.CreatedDate)
            .ToListAsync();
        await _cacheService.SetAsync(CacheKeys.FeaturedCategories, result);
        return Result<List<CategoryResponse>>.Success(result);
    }

    /// <summary>
    /// Retrieves a category by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the category.</param>
    /// <returns>A result containing the category details if found; otherwise, a failure result.</returns>
    public async Task<Result<CategoryResponse>> GetByIdAsync(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Category>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result<CategoryResponse>.Failure("Danh mục không tồn tại");
        }

        var response = entity.MapToCategoryResponse();
        return Result<CategoryResponse>.Success(response);
    }

    /// <summary>
    /// Creates a new category with the provided details and uploads its image.
    /// </summary>
    /// <param name="request">The category data and image to create.</param>
    /// <returns>A result containing the created category response if successful; otherwise, a failure result with an error message.</returns>
    public async Task<Result<CategoryResponse>> CreateAsync(CategoryRequest request)
    {
        var isExists = await _unitOfWork
            .GetRepository<Category>()
            .FindAsync(x => x.Name == request.Name);
        if (isExists != null)
        {
            return Result<CategoryResponse>.Failure("Danh mục đã tồn tại");
        }

        var entity = request.MapToCategory();
        entity.Id = Guid.NewGuid();
        entity.CreatedDate = DateTime.UtcNow;
        entity.CreatedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        var optimizedImage = await _imageService.OptimizeAsync(request.Image, ImageType.Branding);
        if (optimizedImage.IsFailure)
        {
            return Result<CategoryResponse>.Failure(optimizedImage.Message);
        }
        var uploadResult = await _storageService.UploadAsync(
            optimizedImage.Value,
            CommonConst.PublicBucket,
            Path.Combine(FolderUpload, entity.Id.ToString())
        );

        entity.ImageUrl = uploadResult.Url;
        _unitOfWork.GetRepository<Category>().Add(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = entity.MapToCategoryResponse();
        return Result<CategoryResponse>.Success(response);
    }

    /// <summary>
    /// Updates an existing category with new data, including optional image replacement.
    /// </summary>
    /// <param name="request">The updated category data, including an optional new image.</param>
    /// <returns>A result containing the updated category response if successful; otherwise, a failure result with an error message.</returns>
    public async Task<Result<CategoryResponse>> UpdateAsync(CategoryRequest request)
    {
        if (request.Id == Guid.Empty)
        {
            return Result<CategoryResponse>.Failure("Danh mục không tồn tại");
        }
        var isExists = await _unitOfWork
            .GetRepository<Category>()
            .AnyAsync(x => x.Name == request.Name && x.Id != request.Id);
        if (isExists)
        {
            return Result<CategoryResponse>.Failure("Danh mục đã tồn tại");
        }

        var entity = await _unitOfWork.GetRepository<Category>().FindAsync(x => x.Id == request.Id);
        if (entity is null)
        {
            return Result<CategoryResponse>.Failure("Danh mục không tồn tại");
        }

        entity = request.ApplyToCategory(entity);
        entity.UpdatedDate = DateTime.UtcNow;
        entity.UpdatedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        if(request.IsImageEdited)
        {
            if(!string.IsNullOrWhiteSpace(entity.ImageUrl))
            {
                await _storageService.DeleteFromUrlAsync(entity.ImageUrl);
            }
            var optimizedImage = await _imageService.OptimizeAsync(request.Image, ImageType.Branding);
            if (optimizedImage.IsFailure)
            {
                return Result<CategoryResponse>.Failure(optimizedImage.Message);
            }
            var uploadResult = await _storageService.UploadAsync(
                optimizedImage.Value,
                CommonConst.PublicBucket,
                Path.Combine(FolderUpload, entity.Id.ToString())
            );
            entity.ImageUrl = uploadResult.Url;
        }
        _unitOfWork.GetRepository<Category>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = entity.MapToCategoryResponse();
        return Result<CategoryResponse>.Success(response);
    }

    /// <summary>
    /// Marks a category as deleted by its ID and updates deletion metadata.
    /// </summary>
    /// <param name="id">The unique identifier of the category to delete.</param>
    /// <returns>A result indicating success or failure with a corresponding message.</returns>
    public async Task<Result<string>> DeleteAsync(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Category>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result<string>.Failure("Danh mục không tồn tại");
        }

        entity.DeletedDate = DateTime.UtcNow;
        entity.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<Category>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    /// <summary>
    /// Marks multiple categories as deleted based on the provided list of IDs.
    /// </summary>
    /// <param name="ids">A list of category IDs to delete.</param>
    /// <returns>A result indicating success or failure with a corresponding message.</returns>
    public async Task<Result<string>> DeleteListAsync(List<Guid> ids)
    {
        foreach (var id in ids)
        {
            var entity = await _unitOfWork.GetRepository<Category>().GetByIdAsync(id);
            if (entity is null)
            {
                return Result<string>.Failure("Danh mục không tồn tại");
            }

            entity.DeletedDate = DateTime.UtcNow;
            entity.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
            entity.IsDeleted = true;
            _unitOfWork.GetRepository<Category>().Update(entity);
        }

        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    /// <summary>
    /// Retrieves a list of non-deleted categories formatted as combo box items.
    /// </summary>
    /// <returns>A result containing a list of combo box items with category IDs and names.</returns>
    public async Task<Result<List<ComboBoxItem>>> GetComboBoxAsync()
    {
        var result = await _unitOfWork
            .GetRepository<Category>()
            .GetAll(x => x.IsDeleted == false)
            .Select(x => new ComboBoxItem { Value = x.Id.ToString(), Text = x.Name })
            .ToListAsync();
        return Result<List<ComboBoxItem>>.Success(result);
    }

    private static Expression<Func<Category, object>>? GetSortExpression(string? orderBy)
    {
        return orderBy?.ToLower() switch
        {
            "name" => x => x.Name,
            "createdDate" => x => x.CreatedDate,
            "updatedDate" => x => x.UpdatedDate,
            _ => null,
        };
    }
}

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
using Application.Shared;

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

    public async Task<Result<PaginatedList<CategoryResponse>>> GetListAsync(
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

        var dtoQuery = categoryQuery.ProjectToCategoryResponse();
        var result = await PaginatedList<CategoryResponse>.CreateAsync(dtoQuery, request.PageIndex, request.PageSize, cancellationToken);
        return Result<PaginatedList<CategoryResponse>>.Success(result);
    }

    public async Task<Result<List<CategoryResponse>>> GetFeaturedAsync(CancellationToken cancellationToken = default)
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
            .ToListAsync(cancellationToken);
        await _cacheService.SetAsync(CacheKeys.FeaturedCategories, result);
        return Result<List<CategoryResponse>>.Success(result);
    }

    public async Task<Result<CategoryResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        var entity = await _unitOfWork.GetRepository<Category>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result<CategoryResponse>.Failure("Danh mục không tồn tại");
        }

        var response = entity.MapToCategoryResponse();
        return Result<CategoryResponse>.Success(response);
    }

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

    public async Task<Result<List<ComboBoxItem>>> GetComboBoxAsync(CancellationToken cancellationToken = default)
    {
        var result = await _unitOfWork
            .GetRepository<Category>()
            .GetAll()
            .Select(x => new ComboBoxItem { Value = x.Id.ToString(), Text = x.Name })
            .ToListAsync(cancellationToken);
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

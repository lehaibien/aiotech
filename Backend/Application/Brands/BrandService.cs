using System.Data;
using System.Linq.Expressions;
using Application.Abstractions;
using Application.Brands.Dtos;
using Application.Helpers;
using Application.Images;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Shared;

namespace Application.Brands;

public class BrandService : IBrandService
{
    private const string FolderUpload = "images/brands";
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IImageService _imageService;
    private readonly IStorageService _storageService;
    private readonly ILogger<BrandService> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="BrandService"/> class with required dependencies for brand management, image processing, storage, and logging.
    /// </summary>
    public BrandService(
        IUnitOfWork unitOfWork,
        IHttpContextAccessor contextAccessor,
        IImageService imageService,
        IStorageService storageService,
        ILogger<BrandService> logger
    )
    {
        _unitOfWork = unitOfWork;
        _contextAccessor = contextAccessor;
        _imageService = imageService;
        _storageService = storageService;
        _logger = logger;
    }

    /// <summary>
    /// Retrieves a paginated and optionally filtered list of brands, supporting text search and sorting.
    /// </summary>
    /// <param name="request">Pagination, filtering, and sorting options for the brand list.</param>
    /// <param name="cancellationToken">Token to cancel the asynchronous operation.</param>
    /// <returns>A result containing a paginated list of brands matching the specified criteria.</returns>
    public async Task<Result<PaginatedList>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var brandQuery = _unitOfWork.GetRepository<Brand>().GetAll();
        if (!string.IsNullOrEmpty(request.TextSearch))
        {
            brandQuery = brandQuery.Where(x =>
                x.Name.ToLower().Contains(request.TextSearch.ToLower())
            );
        }
        var sortCol = GetSortExpression(request.SortColumn);
        if (sortCol is null)
        {
            brandQuery = brandQuery
                .OrderByDescending(x => x.UpdatedDate)
                .ThenByDescending(x => x.CreatedDate);
        }
        else
        {
            if (request.SortOrder?.ToLower() == "desc")
            {
                brandQuery = brandQuery.OrderByDescending(sortCol);
            }
            else
            {
                brandQuery = brandQuery.OrderBy(sortCol);
            }
        }
        var totalRow = await brandQuery.CountAsync(cancellationToken);
        var result = await brandQuery
            .Skip(request.PageIndex * request.PageSize)
            .Take(request.PageSize)
            .ProjectToBrandResponse()
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
    /// Retrieves a brand by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the brand.</param>
    /// <returns>A result containing the brand details if found; otherwise, a failure result.</returns>
    public async Task<Result<BrandResponse>> GetById(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Brand>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result<BrandResponse>.Failure("Thương hiệu không tồn tại");
        }

        var response = entity.MapToBrandResponse();
        return Result<BrandResponse>.Success(response);
    }

    /// <summary>
    /// Creates a new brand with the provided details, including image optimization and upload.
    /// </summary>
    /// <param name="request">The brand information and image to create.</param>
    /// <returns>A result containing the created brand's details, or a failure message if creation is unsuccessful.</returns>
    public async Task<Result<BrandResponse>> Create(BrandRequest request)
    {
        var isExists = await _unitOfWork
            .GetRepository<Brand>()
            .FindAsync(x => x.Name == request.Name);
        if (isExists != null)
        {
            return Result<BrandResponse>.Failure("Thương hiệu đã tồn tại");
        }
        // var entity = _mapper.Map<Brand>(request);
        var entity = request.MapToBrand();
        entity.Id = Guid.NewGuid();
        entity.CreatedDate = DateTime.UtcNow;
        entity.CreatedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        var optimizedImage = await _imageService.OptimizeAsync(request.Image, ImageType.Branding);
        if (optimizedImage.IsFailure)
        {
            return Result<BrandResponse>.Failure(optimizedImage.Message);
        }
        var uploadResult = await _storageService.UploadAsync(
            optimizedImage.Value,
            CommonConst.PublicBucket,
            Path.Combine(FolderUpload, entity.Id.ToString())
        );
        entity.ImageUrl = uploadResult.Url;
        _unitOfWork.GetRepository<Brand>().Add(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = entity.MapToBrandResponse();
        return Result<BrandResponse>.Success(response);
    }

    /// <summary>
    /// Updates an existing brand with new information and optionally replaces its image.
    /// </summary>
    /// <param name="request">The updated brand data, including image if it has been edited.</param>
    /// <returns>A result containing the updated brand response, or a failure message if the update is unsuccessful.</returns>
    public async Task<Result<BrandResponse>> Update(BrandRequest request)
    {
        if (request.Id == Guid.Empty)
        {
            return Result<BrandResponse>.Failure("Thương hiệu không tồn tại");
        }
        var isExists = await _unitOfWork
            .GetRepository<Brand>()
            .AnyAsync(x => x.Name == request.Name && x.Id != request.Id);
        if (isExists)
        {
            return Result<BrandResponse>.Failure("Thương hiệu đã tồn tại");
        }
        var entity = await _unitOfWork.GetRepository<Brand>().FindAsync(x => x.Id == request.Id);
        if (entity is null)
        {
            return Result<BrandResponse>.Failure("Thương hiệu không tồn tại");
        }
        entity = request.ApplyToBrand(entity);
        entity.UpdatedDate = DateTime.UtcNow;
        entity.UpdatedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        if (request.IsImageEdited)
        {
            if(!string.IsNullOrWhiteSpace(entity.ImageUrl))
            {
                await _storageService.DeleteFromUrlAsync(entity.ImageUrl);
            }
            var optimizedImage = await _imageService.OptimizeAsync(
                request.Image,
                ImageType.Branding
            );
            if (optimizedImage.IsFailure)
            {
                return Result<BrandResponse>.Failure(optimizedImage.Message);
            }
            var uploadResult = await _storageService.UploadAsync(
                optimizedImage.Value,
                CommonConst.PublicBucket,
                Path.Combine(FolderUpload, entity.Id.ToString())
            );
            entity.ImageUrl = uploadResult.Url;
        }
        _unitOfWork.GetRepository<Brand>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = entity.MapToBrandResponse();
        return Result<BrandResponse>.Success(response);
    }

    /// <summary>
    /// Marks a brand as deleted by its ID, setting deletion metadata and saving changes.
    /// </summary>
    /// <param name="id">The unique identifier of the brand to delete.</param>
    /// <returns>A result indicating success or failure with an appropriate message.</returns>
    public async Task<Result<string>> Delete(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Brand>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result<string>.Failure("Thương hiệu không tồn tại");
        }
        entity.DeletedDate = DateTime.UtcNow;
        entity.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<Brand>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    /// <summary>
    /// Marks multiple brands as deleted by their IDs.
    /// </summary>
    /// <param name="ids">List of brand IDs to delete.</param>
    /// <returns>A result indicating success or failure with a message.</returns>
    public async Task<Result<string>> DeleteList(List<Guid> ids)
    {
        foreach (var id in ids)
        {
            var entity = await _unitOfWork.GetRepository<Brand>().GetByIdAsync(id);
            if (entity is null)
            {
                return Result<string>.Failure("Thương hiệu không tồn tại");
            }
            entity.DeletedDate = DateTime.UtcNow;
            entity.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
            entity.IsDeleted = true;
            _unitOfWork.GetRepository<Brand>().Update(entity);
        }
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    public async Task<Result<List<ComboBoxItem>>> GetComboBox()
    {
        var result = await _unitOfWork
            .GetRepository<Brand>()
            .GetAll()
            .Select(x => new ComboBoxItem { Value = x.Id.ToString(), Text = x.Name })
            .ToListAsync();
        return Result<List<ComboBoxItem>>.Success(result);
    }

    private static Expression<Func<Brand, object>>? GetSortExpression(string? orderBy)
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

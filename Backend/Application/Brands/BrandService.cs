using System.Data;
using System.Linq.Expressions;
using Application.Abstractions;
using Application.Brands.Dtos;
using Application.Helpers;
using Application.Images;
using Application.Shared;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Brands;

public class BrandService : IBrandService
{
    private const string FolderUpload = "images/brands";
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IImageService _imageService;
    private readonly IStorageService _storageService;
    private readonly ILogger<BrandService> _logger;

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

    public async Task<Result<PaginatedList<BrandResponse>>> GetListAsync(
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
        var dtoQuery = brandQuery.ProjectToBrandResponse();
        var result = await PaginatedList<BrandResponse>.CreateAsync(
            dtoQuery,
            request.PageIndex,
            request.PageSize,
            cancellationToken
        );
        return Result<PaginatedList<BrandResponse>>.Success(result);
    }

    public async Task<Result<BrandResponse>> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default
    )
    {
        var entity = await _unitOfWork.GetRepository<Brand>().GetByIdAsync(id, cancellationToken);
        if (entity is null)
        {
            return Result<BrandResponse>.Failure("Thương hiệu không tồn tại");
        }

        var response = entity.MapToBrandResponse();
        return Result<BrandResponse>.Success(response);
    }

    public async Task<Result<BrandResponse>> CreateAsync(BrandRequest request)
    {
        var isExists = await _unitOfWork
            .GetRepository<Brand>()
            .FindAsync(x => x.Name == request.Name);
        if (isExists != null)
        {
            return Result<BrandResponse>.Failure("Thương hiệu đã tồn tại");
        }
        var entity = request.MapToBrand();
        entity.Id = Guid.NewGuid();
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
        _logger.LogInformation("Brand created with ID: {BrandId} and Name: {BrandName}", entity.Id, entity.Name);
        var response = entity.MapToBrandResponse();
        return Result<BrandResponse>.Success(response);
    }

    public async Task<Result<BrandResponse>> UpdateAsync(BrandRequest request)
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
        if (request.IsImageEdited)
        {
            if (!string.IsNullOrWhiteSpace(entity.ImageUrl))
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
        _logger.LogInformation("Brand updated with ID: {BrandId} and Name: {BrandName}", entity.Id, entity.Name);
        var response = entity.MapToBrandResponse();
        return Result<BrandResponse>.Success(response);
    }

    public async Task<Result> DeleteAsync(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Brand>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result.Failure("Thương hiệu không tồn tại");
        }
        entity.DeletedDate = DateTime.UtcNow;
        entity.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<Brand>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation("Brand marked as deleted with ID: {BrandId} and Name: {BrandName}", entity.Id, entity.Name);
        return Result.Success();
    }

    public async Task<Result> DeleteListAsync(List<Guid> ids)
    {
        foreach (var id in ids)
        {
            var entity = await _unitOfWork.GetRepository<Brand>().GetByIdAsync(id);
            if (entity is null)
            {
                return Result.Failure("Thương hiệu không tồn tại");
            }
            entity.DeletedDate = DateTime.UtcNow;
            entity.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
            entity.IsDeleted = true;
            _unitOfWork.GetRepository<Brand>().Update(entity);
        }
        await _unitOfWork.SaveChangesAsync();
        _logger.LogInformation("Brands marked as deleted with IDs: {BrandIds}", string.Join(", ", ids));
        return Result.Success();
    }

    public async Task<Result<List<ComboBoxItem>>> GetComboBoxAsync(
        CancellationToken cancellationToken = default
    )
    {
        var result = await _unitOfWork
            .GetRepository<Brand>()
            .GetAll()
            .Select(x => new ComboBoxItem { Value = x.Id.ToString(), Text = x.Name })
            .ToListAsync(cancellationToken);
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

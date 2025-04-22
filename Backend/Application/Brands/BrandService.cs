using System.Data;
using System.Linq.Expressions;
using Application.Brands.Dtos;
using Application.Images;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Application.Brands;

public class BrandService : IBrandService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IImageService _imageService;
    private const string FolderUpload = "brands";

    public BrandService(
        IUnitOfWork unitOfWork,
        IHttpContextAccessor contextAccessor,
        IImageService imageService
    )
    {
        _unitOfWork = unitOfWork;
        _contextAccessor = contextAccessor;
        _imageService = imageService;
    }

    public async Task<Result<PaginatedList>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var brandQuery = _unitOfWork.GetRepository<Brand>().GetAll();
        if(!string.IsNullOrEmpty(request.TextSearch))
        {
            brandQuery = brandQuery.Where(x =>
                x.Name.ToLower().Contains(request.TextSearch.ToLower())
            );
        }
        var sortCol = GetSortExpression(request.SortColumn);
        if(sortCol is null)
        {
            brandQuery = brandQuery
                .OrderByDescending(x => x.UpdatedDate)
                .ThenByDescending(x => x.CreatedDate);
        }
        else
        {
            if(request.SortOrder?.ToLower() == "desc")
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

    public async Task<Result<BrandResponse>> GetById(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Brand>().GetByIdAsync(id);
        if(entity is null)
        {
            return Result<BrandResponse>.Failure("Thương hiệu không tồn tại");
        }

        var response = entity.MapToBrandResponse();
        return Result<BrandResponse>.Success(response);
    }

    public async Task<Result<BrandResponse>> Create(CreateBrandRequest request)
    {
        var isExists = await _unitOfWork
            .GetRepository<Brand>()
            .FindAsync(x => x.Name == request.Name);
        if(isExists != null)
        {
            return Result<BrandResponse>.Failure("Thương hiệu đã tồn tại");
        }
        // var entity = _mapper.Map<Brand>(request);
        var entity = request.MapToBrand();
        entity.Id = Guid.NewGuid();
        entity.CreatedDate = DateTime.UtcNow;
        entity.CreatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        var uploadResult = await _imageService.UploadAsync(
            request.Image,
            ImageType.Branding,
            Path.Combine(FolderUpload, entity.Id.ToString())
        );
        if(uploadResult.IsFailure)
        {
            return Result<BrandResponse>.Failure(uploadResult.Message);
        }
        entity.ImageUrl = uploadResult.Value;
        _unitOfWork.GetRepository<Brand>().Add(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = entity.MapToBrandResponse();
        return Result<BrandResponse>.Success(response);
    }

    public async Task<Result<BrandResponse>> Update(UpdateBrandRequest request)
    {
        var isExists = await _unitOfWork
            .GetRepository<Brand>()
            .AnyAsync(x => x.Name == request.Name && x.Id != request.Id);
        if(isExists)
        {
            return Result<BrandResponse>.Failure("Thương hiệu đã tồn tại");
        }
        var entity = await _unitOfWork.GetRepository<Brand>().FindAsync(x => x.Id == request.Id);
        if(entity is null)
        {
            return Result<BrandResponse>.Failure("Thương hiệu không tồn tại");
        }
        entity = request.ApplyToBrand(entity);
        entity.UpdatedDate = DateTime.UtcNow;
        entity.UpdatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        if(entity.ImageUrl is not null)
        {
            var deleteResult = _imageService.DeleteByUrl(entity.ImageUrl);
            if(deleteResult.IsFailure)
            {
                return Result<BrandResponse>.Failure(deleteResult.Message);
            }
        }

        var uploadResult = await _imageService.UploadAsync(
            request.Image,
            ImageType.Branding,
            Path.Combine(FolderUpload, entity.Id.ToString())
        );
        if(uploadResult.IsFailure)
        {
            return Result<BrandResponse>.Failure(uploadResult.Message);
        }
        entity.ImageUrl = uploadResult.Value;
        _unitOfWork.GetRepository<Brand>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = entity.MapToBrandResponse();
        return Result<BrandResponse>.Success(response);
    }

    public async Task<Result<string>> Delete(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Brand>().GetByIdAsync(id);
        if(entity is null)
        {
            return Result<string>.Failure("Thương hiệu không tồn tại");
        }
        entity.DeletedDate = DateTime.UtcNow;
        entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<Brand>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    public async Task<Result<string>> DeleteList(List<Guid> ids)
    {
        foreach(var id in ids)
        {
            var entity = await _unitOfWork.GetRepository<Brand>().GetByIdAsync(id);
            if(entity is null)
            {
                return Result<string>.Failure("Thương hiệu không tồn tại");
            }
            entity.DeletedDate = DateTime.UtcNow;
            entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
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

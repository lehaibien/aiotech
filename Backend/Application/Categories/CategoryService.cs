using System.Data;
using System.Linq.Expressions;
using Application.Categories.Dtos;
using Application.Images;
using AutoMapper;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using Shared;

namespace Application.Categories;

public class CategoryService : ICategoryService
{
    private const string FolderUpload = "categories";
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IImageService _imageService;
    private readonly IDistributedCache _cache;

    public CategoryService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IHttpContextAccessor contextAccessor,
        IImageService imageService,
        IDistributedCache cache
    )
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _contextAccessor = contextAccessor;
        _imageService = imageService;
        _cache = cache;
    }

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
            .Select(x => new CategoryResponse
            {
                Id = x.Id,
                Name = x.Name,
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

    public async Task<Result<List<CategoryResponse>>> GetFeaturedAsync()
    {
        var categoryInCache = await _cache.GetStringAsync(CacheKeys.FeaturedCategories);
        if (categoryInCache is not null)
        {
            var res = JsonConvert.DeserializeObject<List<CategoryResponse>>(categoryInCache);
            return Result<List<CategoryResponse>>.Success(res);
        }
        var result = await _unitOfWork
            .GetRepository<Category>()
            .GetAll(x => x.IsDeleted == false)
            .Select(x => new CategoryResponse
            {
                Id = x.Id,
                Name = x.Name,
                ImageUrl = x.ImageUrl,
                CreatedDate = x.CreatedDate,
                CreatedBy = x.CreatedBy,
                UpdatedDate = x.UpdatedDate,
                UpdatedBy = x.UpdatedBy,
            })
            .OrderByDescending(x => x.CreatedDate)
            .ToListAsync();
        var json = JsonConvert.SerializeObject(result);
        await _cache.SetStringAsync(CacheKeys.FeaturedCategories, json);
        return Result<List<CategoryResponse>>.Success(result);
    }

    public async Task<Result<CategoryResponse>> GetById(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Category>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result<CategoryResponse>.Failure("Thể loại không tồn tại");
        }

        var response = _mapper.Map<CategoryResponse>(entity);
        return Result<CategoryResponse>.Success(response);
    }

    public async Task<Result<CategoryResponse>> Create(CreateCategoryRequest request)
    {
        var isExists = await _unitOfWork
            .GetRepository<Category>()
            .FindAsync(x => x.Name == request.Name);
        if (isExists != null)
        {
            return Result<CategoryResponse>.Failure("Thể loại đã tồn tại");
        }

        var entity = _mapper.Map<Category>(request);
        entity.Id = Guid.NewGuid();
        entity.CreatedDate = DateTime.UtcNow;
        entity.CreatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        var uploadResult = await _imageService.UploadAsync(
            request.Image,
            ImageType.Category,
            Path.Combine(FolderUpload, entity.Id.ToString())
        );
        if (uploadResult.IsFailure)
        {
            return Result<CategoryResponse>.Failure(uploadResult.Message);
        }

        entity.ImageUrl = uploadResult.Data;
        _unitOfWork.GetRepository<Category>().Add(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = _mapper.Map<CategoryResponse>(entity);
        return Result<CategoryResponse>.Success(response);
    }

    public async Task<Result<CategoryResponse>> Update(UpdateCategoryRequest request)
    {
        var isExists = await _unitOfWork
            .GetRepository<Category>()
            .AnyAsync(x => x.Name == request.Name && x.Id != request.Id);
        if (isExists)
        {
            return Result<CategoryResponse>.Failure("Thể loại đã tồn tại");
        }

        var entity = await _unitOfWork.GetRepository<Category>().FindAsync(x => x.Id == request.Id);
        if (entity is null)
        {
            return Result<CategoryResponse>.Failure("Thể loại không tồn tại");
        }

        _mapper.Map(request, entity);
        entity.UpdatedDate = DateTime.UtcNow;
        entity.UpdatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        if (entity.ImageUrl is not null)
        {
            var deleteResult = _imageService.DeleteByUrl(entity.ImageUrl);
            if (deleteResult.IsFailure)
            {
                return Result<CategoryResponse>.Failure(deleteResult.Message);
            }
        }

        var uploadResult = await _imageService.UploadAsync(
            request.Image,
            ImageType.Category,
            Path.Combine(FolderUpload, entity.Id.ToString())
        );
        if (uploadResult.IsFailure)
        {
            return Result<CategoryResponse>.Failure(uploadResult.Message);
        }

        entity.ImageUrl = uploadResult.Data;
        _unitOfWork.GetRepository<Category>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = _mapper.Map<CategoryResponse>(entity);
        return Result<CategoryResponse>.Success(response);
    }

    public async Task<Result<string>> Delete(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Category>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result<string>.Failure("Thể loại không tồn tại");
        }

        entity.DeletedDate = DateTime.UtcNow;
        entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<Category>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    public async Task<Result<string>> DeleteList(List<Guid> ids)
    {
        foreach (var id in ids)
        {
            var entity = await _unitOfWork.GetRepository<Category>().GetByIdAsync(id);
            if (entity is null)
            {
                return Result<string>.Failure("Thể loại không tồn tại");
            }

            entity.DeletedDate = DateTime.UtcNow;
            entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
            entity.IsDeleted = true;
            _unitOfWork.GetRepository<Category>().Update(entity);
        }

        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    public async Task<Result<List<ComboBoxItem>>> GetComboBox()
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

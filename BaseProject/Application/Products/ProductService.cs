using System.Data;
using Application.Images;
using Application.Mail;
using Application.Products.Dtos;
using AutoDependencyRegistration.Attributes;
using AutoMapper;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Application.Products;

[RegisterClassAsScoped]
public class ProductService : IProductService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IImageService _imageService;
    private const string FolderUpload = "products";
    private readonly IEmailService _emailService;

    public ProductService(
        IUnitOfWork unitOfWork,
        IMapper mapper,
        IHttpContextAccessor contextAccessor,
        IImageService imageService,
        IEmailService emailService
    )
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _contextAccessor = contextAccessor;
        _imageService = imageService;
        _emailService = emailService;
    }

    public async Task<Result<PaginatedList>> GetList(GetListProductRequest request)
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
            new("@iMinPrice", request.MinPrice),
            new(
                "@iMaxPrice",
                double.IsInfinity(request.MaxPrice) ? double.MaxValue : request.MaxPrice
            ),
            new("@iCategories", string.Join(',', request.Categories?.Split(',') ?? [])),
            new("@iBrands", string.Join(',', request.Brands?.Split(',') ?? [])),
            new("@iSort", request.Sort),
            new("@iPageIndex", request.PageIndex),
            new("@iPageSize", request.PageSize),
            totalRow,
        };
        var result = await _unitOfWork
            .GetRepository<ProductResponse>()
            .ExecuteStoredProcedureAsync(StoredProcedure.GetListProduct, parameters);
        var response = new PaginatedList
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = Convert.ToInt32(totalRow.Value),
            Items = result,
        };
        return Result<PaginatedList>.Success(response);
    }

    public async Task<Result<List<ProductResponse>>> Search(SearchProductRequest request)
    {
        var result = await _unitOfWork
            .GetRepository<Product>()
            .GetAll()
            .Where(x =>
                x.IsDeleted == false
                && (request.Category == null || x.Category.Name == request.Category)
                && x.Name.Contains(request.TextSearch)
            )
            .Take(request.SearchLimit)
            .ToListAsync();
        var response = _mapper.Map<List<ProductResponse>>(result);
        return Result<List<ProductResponse>>.Success(response);
    }

    public async Task<Result<List<ProductResponse>>> GetTopProducts(int top = 12)
    {
        var result = await _unitOfWork
            .GetRepository<Product>()
            .GetAll(x => x.IsDeleted == false)
            .OrderByDescending(x => x.IsFeatured)
            .ThenByDescending(x => x.CreatedDate)
            .Take(top)
            .ToListAsync();
        var response = _mapper.Map<List<ProductResponse>>(result);
        return Result<List<ProductResponse>>.Success(response);
    }

    public async Task<Result<List<ProductResponse>>> GetRelatedProducts(
        GetRelatedProductsRequest request
    )
    {
        var entity = await _unitOfWork.GetRepository<Product>().GetByIdAsync(request.Id);
        if (entity is null)
        {
            return Result<List<ProductResponse>>.Failure("Sản phẩm không tồn tại");
        }
        var result = await _unitOfWork
            .GetRepository<Product>()
            .GetAll(x =>
                x.IsDeleted == false && x.Id != request.Id && x.CategoryId == entity.CategoryId
            )
            .OrderByDescending(x => x.CreatedDate)
            .Take(request.Limit)
            .ToListAsync();
        var response = _mapper.Map<List<ProductResponse>>(result);
        return Result<List<ProductResponse>>.Success(response);
    }

    public async Task<Result<ProductDetailResponse>> GetById(Guid id)
    {
        var entity = await _unitOfWork
            .GetRepository<Product>()
            .GetAll(x => x.Id == id)
            .Select(x => new ProductDetailResponse
            {
                Id = x.Id,
                Sku = x.Sku,
                Name = x.Name,
                Brand = x.Brand != null ? x.Brand.Name : "",
                Category = x.Category != null ? x.Category.Name : "",
                Rating = x.Reviews.Count > 0 ? x.Reviews.Average(r => r.Rating) : 0,
                ImageUrls = x.ImageUrls,
                Price = x.Price,
                DiscountPrice = x.DiscountPrice,
                Stock = x.Stock,
                Description = x.Description,
                IsFeatured = x.IsFeatured,
                Tags = new List<string>(),
            })
            .FirstOrDefaultAsync();
        if (entity is null)
        {
            return Result<ProductDetailResponse>.Failure("Sản phẩm không tồn tại");
        }

        return Result<ProductDetailResponse>.Success(entity);
    }

    public async Task<Result<ProductUpdateResponse>> GetRequestById(Guid id)
    {
        var entity = await _unitOfWork
            .GetRepository<Product>()
            .GetAll()
            .FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null)
        {
            return Result<ProductUpdateResponse>.Failure("Sản phẩm không tồn tại");
        }
        var response = _mapper.Map<ProductUpdateResponse>(entity);
        return Result<ProductUpdateResponse>.Success(response);
    }

    public async Task<Result<ProductResponse>> Create(CreateProductRequest request)
    {
        var isExists = await _unitOfWork
            .GetRepository<Product>()
            .FindAsync(x => x.Name == request.Name && x.Sku == request.Sku);
        if (isExists != null)
        {
            return Result<ProductResponse>.Failure("Sản phẩm đã tồn tại");
        }
        var entity = _mapper.Map<Product>(request);
        entity.CreatedDate = DateTime.Now;
        entity.CreatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        var uploadResult = await _imageService.UploadListAsync(
            request.Images,
            Path.Combine(FolderUpload, entity.Sku)
        );
        if (uploadResult.IsFailure)
        {
            return Result<ProductResponse>.Failure(uploadResult.Message);
        }
        entity.ImageUrls = uploadResult.Data;
        _unitOfWork.GetRepository<Product>().Add(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = _mapper.Map<ProductResponse>(entity);
        return Result<ProductResponse>.Success(response);
    }

    public async Task<Result<ProductResponse>> Update(UpdateProductRequest request)
    {
        var isExists = await _unitOfWork
            .GetRepository<Product>()
            .AnyAsync(x => x.Id != request.Id && x.Name == request.Name && x.Sku == request.Sku);
        if (isExists)
        {
            return Result<ProductResponse>.Failure("Sản phẩm đã tồn tại");
        }
        var entity = await _unitOfWork.GetRepository<Product>().FindAsync(x => x.Id == request.Id);
        if (entity is null)
        {
            return Result<ProductResponse>.Failure("Sản phẩm không tồn tại");
        }
        _mapper.Map(request, entity);
        entity.UpdatedDate = DateTime.Now;
        entity.UpdatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        var deleteResult = await _imageService.DeleteList(entity.ImageUrls);
        if (deleteResult.IsFailure)
        {
            return Result<ProductResponse>.Failure(deleteResult.Message);
        }
        if (request.Images.Count > 0)
        {
            var uploadResult = await _imageService.UploadListAsync(
                request.Images,
                Path.Combine(FolderUpload, entity.Sku)
            );
            if (uploadResult.IsFailure)
            {
                return Result<ProductResponse>.Failure(uploadResult.Message);
            }
            entity.ImageUrls = uploadResult.Data;
        }
        _unitOfWork.GetRepository<Product>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        var response = _mapper.Map<ProductResponse>(entity);
        return Result<ProductResponse>.Success(response);
    }

    public async Task<Result<string>> Delete(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Product>().GetByIdAsync(id);
        if (entity is null)
        {
            return Result<string>.Failure("Sản phẩm không tồn tại");
        }
        entity.DeletedDate = DateTime.Now;
        entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<Product>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }

    public async Task<Result<string>> DeleteList(List<Guid> ids)
    {
        foreach (var id in ids)
        {
            var entity = await _unitOfWork.GetRepository<Product>().GetByIdAsync(id);
            if (entity is null)
            {
                return Result<string>.Failure("Sản phẩm không tồn tại");
            }
            entity.DeletedDate = DateTime.Now;
            entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
            entity.IsDeleted = true;
            _unitOfWork.GetRepository<Product>().Update(entity);
        }
        await _unitOfWork.SaveChangesAsync();
        return Result<string>.Success("Xóa thành công");
    }
}

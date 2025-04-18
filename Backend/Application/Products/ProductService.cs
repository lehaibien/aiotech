﻿using System.Data;
using System.Linq.Expressions;
using Application.Images;
using Application.Products.Dtos;
using AutoDependencyRegistration.Attributes;
using AutoMapper;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
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
    private readonly IDistributedCache _cache;

    public ProductService(
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
        var productQuery = _unitOfWork.GetRepository<Product>().GetAll();
        if (!string.IsNullOrEmpty(request.TextSearch))
        {
            productQuery = productQuery.Where(x =>
                x.Sku.ToLower().Contains(request.TextSearch.ToLower())
                || x.Name.ToLower().Contains(request.TextSearch.ToLower())
            );
        }
        var sortCol = GetSortExpression(request.SortColumn);
        if (sortCol is null)
        {
            productQuery = productQuery
                .OrderByDescending(x => x.UpdatedDate)
                .ThenByDescending(x => x.CreatedDate);
        }
        else
        {
            if (request.SortOrder?.ToLower() == "desc")
            {
                productQuery = productQuery.OrderByDescending(sortCol);
            }
            else
            {
                productQuery = productQuery.OrderBy(sortCol);
            }
        }
        var totalRow = await productQuery.CountAsync(cancellationToken);
        var result = await productQuery
            .Skip(request.PageIndex * request.PageSize)
            .Take(request.PageSize)
            .Select(x => new ProductResponse
            {
                Id = x.Id,
                Sku = x.Sku,
                Name = x.Name,
                Price = x.Price,
                DiscountPrice = x.DiscountPrice,
                Stock = x.Stock,
                Brand = x.Brand.Name,
                Category = x.Category.Name,
                ImageUrls = x.ImageUrls,
                CreatedDate = x.CreatedDate,
                Rating = x.Reviews.Count > 0 ? x.Reviews.Average(r => r.Rating) : 0,
                IsFeatured = x.IsFeatured,
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

    public async Task<Result<PaginatedList>> GetListFilteredAsync(
        GetListFilteredProductRequest request
    )
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
            .ExecuteStoredProcedureAsync(StoredProcedure.GetFilteredProduct, parameters);
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
                !x.IsDeleted
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
        var productInCache = await _cache.GetStringAsync(CacheKeys.TopProducts);
        if (productInCache is not null)
        {
            var res = JsonConvert.DeserializeObject<List<ProductResponse>>(productInCache);
            return Result<List<ProductResponse>>.Success(res);
        }
        var result = await _unitOfWork
            .GetRepository<Product>()
            .GetAll(x => x.Stock >= 8)
            .Select(x => new ProductResponse
            {
                Id = x.Id,
                Sku = x.Sku,
                Name = x.Name,
                Price = x.Price,
                DiscountPrice = x.DiscountPrice,
                Stock = x.Stock,
                Brand = x.Brand.Name,
                Category = x.Category.Name,
                ImageUrls = x.ImageUrls,
                CreatedDate = x.CreatedDate,
                Rating = x.Reviews.Count > 0 ? x.Reviews.Average(r => r.Rating) : 0,
                IsFeatured = x.IsFeatured,
            })
            .OrderByDescending(p =>
                _unitOfWork
                    .GetRepository<OrderItem>()
                    .GetAll()
                    .Count(oi =>
                        oi.ProductId == p.Id
                        && !oi.Order.IsDeleted
                        && oi.Order.Status != OrderStatus.Cancelled
                    )
            )
            .ThenByDescending(x => x.IsFeatured)
            .ThenByDescending(x => x.Rating)
            .ThenByDescending(x => x.CreatedDate)
            .Take(top)
            .ToListAsync();
        var json = JsonConvert.SerializeObject(result);
        await _cache.SetStringAsync(CacheKeys.TopProducts, json);
        return Result<List<ProductResponse>>.Success(result);
    }

    public async Task<Result<List<ProductResponse>>> GetFeaturedProducts(int top = 12)
    {
        var productInCache = await _cache.GetStringAsync(CacheKeys.FeaturedProducts);
        if (productInCache is not null)
        {
            var res = JsonConvert.DeserializeObject<List<ProductResponse>>(productInCache);
            return Result<List<ProductResponse>>.Success(res);
        }
        var result = await _unitOfWork
            .GetRepository<Product>()
            .GetAll(x => x.Stock >= 10)
            .Select(x => new ProductResponse
            {
                Id = x.Id,
                Sku = x.Sku,
                Name = x.Name,
                Price = x.Price,
                DiscountPrice = x.DiscountPrice,
                Stock = x.Stock,
                Brand = x.Brand.Name,
                Category = x.Category.Name,
                ImageUrls = x.ImageUrls,
                CreatedDate = x.CreatedDate,
                Rating = x.Reviews.Count > 0 ? x.Reviews.Average(r => r.Rating) : 0,
                IsFeatured = x.IsFeatured,
            })
            .Where(x => x.IsFeatured)
            .OrderByDescending(x => x.CreatedDate)
            .ThenByDescending(x => x.Rating)
            .Take(top)
            .ToListAsync();

        var json = JsonConvert.SerializeObject(result);
        await _cache.SetStringAsync(CacheKeys.FeaturedProducts, json);
        return Result<List<ProductResponse>>.Success(result);
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

        // Get all potential related products
        var allRelatedProducts = await _unitOfWork
            .GetRepository<Product>()
            .GetAll(x => x.Id != request.Id)
            .Select(x => new ProductResponse
            {
                Id = x.Id,
                Sku = x.Sku,
                Name = x.Name,
                Price = x.Price,
                DiscountPrice = x.DiscountPrice,
                Stock = x.Stock,
                Brand = x.Brand.Name,
                Category = x.Category.Name,
                ImageUrls = x.ImageUrls,
                CreatedDate = x.CreatedDate,
                Rating = x.Reviews.Count > 0 ? x.Reviews.Average(r => r.Rating) : 0,
                IsFeatured = x.IsFeatured,
                CategoryId = x.CategoryId,
                BrandId = x.BrandId,
            })
            .ToListAsync();

        // Process in memory
        var result = new List<ProductResponse>();

        // First priority: same category
        var sameCategoryProducts = allRelatedProducts
            .Where(x => x.CategoryId == entity.CategoryId)
            .OrderByDescending(x => x.Rating)
            .ThenByDescending(x => x.CreatedDate)
            .Take(request.Limit)
            .ToList();

        result.AddRange(sameCategoryProducts);

        if (result.Count < request.Limit)
        {
            // Second priority: same brand, different category
            var remainingCount = request.Limit - result.Count;
            var sameBrandProducts = allRelatedProducts
                .Where(x =>
                    x.BrandId == entity.BrandId
                    && x.CategoryId != entity.CategoryId
                    && !result.Select(r => r.Id).Contains(x.Id)
                )
                .OrderByDescending(x => x.Rating)
                .ThenByDescending(x => x.CreatedDate)
                .Take(remainingCount)
                .ToList();

            result.AddRange(sameBrandProducts);
        }

        if (result.Count < request.Limit)
        {
            // Third priority: other products
            var remainingCount = request.Limit - result.Count;
            var otherProducts = allRelatedProducts
                .Where(x => !result.Select(r => r.Id).Contains(x.Id))
                .OrderByDescending(x => x.IsFeatured)
                .ThenByDescending(x => x.Rating)
                .ThenByDescending(x => x.CreatedDate)
                .Take(remainingCount)
                .ToList();

            result.AddRange(otherProducts);
        }

        return Result<List<ProductResponse>>.Success(result);
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
                Tags = x.Tags,
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
        entity.CreatedDate = DateTime.UtcNow;
        entity.CreatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        var uploadResult = await _imageService.UploadBulkAsync(
            request.Images,
            ImageType.ProductDetail,
            Path.Combine(FolderUpload, entity.Sku)
        );
        if (uploadResult.IsFailure)
        {
            return Result<ProductResponse>.Failure(uploadResult.Message);
        }
        entity.ImageUrls = uploadResult.Data;
        _unitOfWork.GetRepository<Product>().Add(entity);
        await _unitOfWork.SaveChangesAsync();
        await _cache.RemoveAsync(CacheKeys.TopProducts);
        await _cache.RemoveAsync(CacheKeys.FeaturedProducts);
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
        entity.UpdatedDate = DateTime.UtcNow;
        entity.UpdatedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        var deleteResult = _imageService.DeleteBulkByUrl(entity.ImageUrls);
        if (deleteResult.IsFailure)
        {
            return Result<ProductResponse>.Failure(deleteResult.Message);
        }
        if (request.Images.Count > 0)
        {
            var uploadResult = await _imageService.UploadBulkAsync(
                request.Images,
                ImageType.ProductDetail,
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
        await _cache.RemoveAsync(CacheKeys.TopProducts);
        await _cache.RemoveAsync(CacheKeys.FeaturedProducts);
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
        entity.DeletedDate = DateTime.UtcNow;
        entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<Product>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        await _cache.RemoveAsync(CacheKeys.TopProducts);
        await _cache.RemoveAsync(CacheKeys.FeaturedProducts);
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
            entity.DeletedDate = DateTime.UtcNow;
            entity.DeletedBy = _contextAccessor.HttpContext.User.Identity.Name ?? "system";
            entity.IsDeleted = true;
            _unitOfWork.GetRepository<Product>().Update(entity);
        }
        await _unitOfWork.SaveChangesAsync();
        await _cache.RemoveAsync(CacheKeys.TopProducts);
        await _cache.RemoveAsync(CacheKeys.FeaturedProducts);
        return Result<string>.Success("Xóa thành công");
    }

    private static Expression<Func<Product, object>>? GetSortExpression(string? orderBy)
    {
        return orderBy?.ToLower() switch
        {
            "sku" => x => x.Sku,
            "name" => x => x.Name,
            "price" => x => x.Price,
            "discountPrice" => x => x.DiscountPrice,
            "stock" => x => x.Stock,
            "createdDate" => x => x.CreatedDate,
            _ => null,
        };
    }
}

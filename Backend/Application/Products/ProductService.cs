using System.Linq.Expressions;
using System.Threading.Channels;
using Application.Abstractions;
using Application.Channels;
using Application.Helpers;
using Application.Images;
using Application.Products.Dtos;
using Application.Shared;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace Application.Products;

public class ProductService : IProductService
{
    private const string FolderUpload = "images/products";
    private readonly ICacheService _cacheService;
    private readonly Channel<ESProductSync> _channel;
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IImageService _imageService;
    private readonly ILogger<ProductService> _logger;
    private readonly IStorageService _storageService;
    private readonly IUnitOfWork _unitOfWork;

    public ProductService(
        IUnitOfWork unitOfWork,
        IHttpContextAccessor contextAccessor,
        IImageService imageService,
        IStorageService storageService,
        ICacheService cacheService,
        ILogger<ProductService> logger,
        Channel<ESProductSync> channel
    )
    {
        _unitOfWork = unitOfWork;
        _contextAccessor = contextAccessor;
        _imageService = imageService;
        _storageService = storageService;
        _cacheService = cacheService;
        _logger = logger;
        _channel = channel;
    }

    public async Task<Result<PaginatedList<ProductResponse>>> GetListAsync(
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

        var dtoQuery = productQuery.ProjectToProductResponse();
        var result = await PaginatedList<ProductResponse>.CreateAsync(
            dtoQuery,
            request.PageIndex,
            request.PageSize,
            cancellationToken
        );
        return Result<PaginatedList<ProductResponse>>.Success(result);
    }

    public async Task<Result<PaginatedList<ProductListItemResponse>>> GetListFilteredAsync(
        GetListFilteredProductRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var isUnfilteredFirstPage =
            request.PageIndex == 0
            && string.IsNullOrEmpty(request.TextSearch)
            && request.MinPrice == 0
            && request.MaxPrice == 900000000
            && string.IsNullOrEmpty(request.Categories)
            && string.IsNullOrEmpty(request.Brands)
            && request.Sort == ProductSort.Default;
        if (isUnfilteredFirstPage)
        {
            var cachedResult = await _cacheService.GetAsync<PaginatedList<ProductListItemResponse>>(
                CacheKeys.FirstPageProducts
            );
            if (cachedResult != null)
            {
                return Result<PaginatedList<ProductListItemResponse>>.Success(cachedResult);
            }
        }

        var listBrands = string.IsNullOrWhiteSpace(request.Brands)
            ? []
            : request.Brands.Split(',', options: StringSplitOptions.RemoveEmptyEntries);
        var listCategories = string.IsNullOrWhiteSpace(request.Categories)
            ? []
            : request.Categories.Split(',', options: StringSplitOptions.RemoveEmptyEntries);

        var query = _unitOfWork
            .GetRepository<Product>()
            .GetAll(x =>
                (listBrands.Length == 0 || listBrands.Contains(x.Brand.Name))
                && (listCategories.Length == 0 || listCategories.Contains(x.Category.Name))
                && x.Price >= request.MinPrice
                && x.Price <= request.MaxPrice
                && x.Name.Contains(request.TextSearch)
            );

        query = ApplyFilterSort(query, request.Sort);
        var dtoQuery = query.ProjectToProductListItemResponse();
        var result = await PaginatedList<ProductListItemResponse>.CreateAsync(
            dtoQuery,
            request.PageIndex,
            request.PageSize,
            cancellationToken
        );
        if (isUnfilteredFirstPage)
        {
            await _cacheService.SetAsync(
                CacheKeys.FirstPageProducts,
                result,
                TimeSpan.FromMinutes(30)
            );
        }

        return Result<PaginatedList<ProductListItemResponse>>.Success(result);
    }

    public async Task<Result<List<ProductResponse>>> SearchAsync(
        SearchProductRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var result = await _unitOfWork
            .GetRepository<Product>()
            .GetAll(x =>
                !x.IsDeleted
                && (request.Category == null || x.Category.Name == request.Category)
                && x.Name.Contains(request.TextSearch)
            )
            .ProjectToProductResponse()
            .Take(request.SearchLimit)
            .ToListAsync(cancellationToken);
        return Result<List<ProductResponse>>.Success(result);
    }

    public async Task<Result<List<ProductListItemResponse>>> GetTopProductsAsync(
        int top = 12,
        CancellationToken cancellationToken = default
    )
    {
        var productInCache = await _cacheService.GetAsync<List<ProductListItemResponse>>(
            CacheKeys.TopProducts
        );
        if (productInCache is not null)
        {
            return Result<List<ProductListItemResponse>>.Success(productInCache);
        }

        var orderItems = _unitOfWork
            .GetRepository<OrderItem>()
            .GetAll(oi => oi.Order.Status != OrderStatus.Cancelled && !oi.Order.IsDeleted);
        var result = await _unitOfWork
            .GetRepository<Product>()
            .GetAll(x => x.Stock >= 8)
            .OrderByDescending(p =>
                orderItems.Where(oi => oi.ProductId == p.Id).Sum(oi => oi.Quantity)
            )
            .ThenByDescending(x => x.IsFeatured)
            .ThenByDescending(x => x.Reviews.Count > 0 ? x.Reviews.Average(r => r.Rating) : 0)
            .ThenByDescending(x => x.CreatedDate)
            .ProjectToProductListItemResponse()
            .Take(top)
            .ToListAsync(cancellationToken);
        await _cacheService.SetAsync(CacheKeys.TopProducts, result, TimeSpan.FromMinutes(30));
        return Result<List<ProductListItemResponse>>.Success(result);
    }

    public async Task<Result<List<ProductListItemResponse>>> GetNewestProductsAsync(
        int top = 12,
        CancellationToken cancellationToken = default
    )
    {
        var productInCache = await _cacheService.GetAsync<List<ProductListItemResponse>>(
            CacheKeys.NewestProducts
        );
        if (productInCache is not null)
        {
            return Result<List<ProductListItemResponse>>.Success(productInCache);
        }

        var result = await _unitOfWork
            .GetRepository<Product>()
            .GetAll(x => x.Stock >= 10)
            .OrderByDescending(x => x.CreatedDate)
            .ThenByDescending(x => x.Reviews.Count > 0 ? x.Reviews.Average(r => r.Rating) : 0)
            .ProjectToProductListItemResponse()
            .Take(top)
            .ToListAsync(cancellationToken);

        await _cacheService.SetAsync(CacheKeys.NewestProducts, result, TimeSpan.FromMinutes(30));
        return Result<List<ProductListItemResponse>>.Success(result);
    }

    public async Task<Result<List<ProductListItemResponse>>> GetRelatedProductsAsync(
        GetRelatedProductsRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var entity = await _unitOfWork
            .GetRepository<Product>()
            .GetByIdAsync(request.Id, cancellationToken);
        if (entity is null)
        {
            return Result<List<ProductListItemResponse>>.Failure("Sản phẩm không tồn tại");
        }

        var result = await _unitOfWork
            .GetRepository<Product>()
            .GetAll(x => x.Id != request.Id && x.CategoryId == entity.CategoryId)
            .ProjectToProductListItemResponse()
            .ToListAsync(cancellationToken);
        return Result<List<ProductListItemResponse>>.Success(result);
    }

    public async Task<Result<ProductDetailResponse>> GetByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default
    )
    {
        var entity = await _unitOfWork
            .GetRepository<Product>()
            .GetAll(x => x.Id == id)
            .ProjectToProductDetailResponse()
            .FirstOrDefaultAsync(cancellationToken);
        if (entity is null)
        {
            return Result<ProductDetailResponse>.Failure("Sản phẩm không tồn tại");
        }

        return Result<ProductDetailResponse>.Success(entity);
    }

    public async Task<Result<ProductUpdateResponse>> GetRequestByIdAsync(
        Guid id,
        CancellationToken cancellationToken = default
    )
    {
        var entity = await _unitOfWork
            .GetRepository<Product>()
            .GetAll(x => x.Id == id)
            .FirstOrDefaultAsync(cancellationToken);
        if (entity is null)
        {
            return Result<ProductUpdateResponse>.Failure("Sản phẩm không tồn tại");
        }

        var response = entity.MapToProductUpdateResponse();
        return Result<ProductUpdateResponse>.Success(response);
    }

    public async Task<Result<ProductResponse>> CreateAsync(ProductRequest request)
    {
        _logger.LogInformation(
            "Creating new product with SKU: {Sku}, Name: {Name}",
            request.Sku,
            request.Name
        );
        var isExists = await _unitOfWork
            .GetRepository<Product>()
            .FindAsync(x => x.Name == request.Name && x.Sku == request.Sku);
        if (isExists != null)
        {
            _logger.LogWarning(
                "Product already exists with SKU: {Sku} and Name: {Name} when trying to create",
                request.Sku,
                request.Name
            );
            return Result<ProductResponse>.Failure("Sản phẩm đã tồn tại");
        }

        var entity = request.MapToProduct();

        #region Upload image

        var thumbnailImage = await _imageService.OptimizeAsync(
            request.Thumbnail,
            ImageType.ProductThumbnail,
            "thumbnail"
        );
        var images = await _imageService.OptimizeBulkAsync(request.Images, ImageType.ProductDetail);
        var imageList = new List<IFormFile> { thumbnailImage.Value };
        imageList.AddRange(images.Value);
        var uploadResult = await _storageService.UploadBulkAsync(
            imageList,
            CommonConst.PublicBucket,
            Path.Combine(FolderUpload, entity.Sku)
        );
        var value = uploadResult.ToList();

        #endregion

        entity.ThumbnailUrl = value[0].Url;
        entity.ImageUrls = value.Skip(1).Select(x => x.Url).ToList();
        _unitOfWork.GetRepository<Product>().Add(entity);
        await _unitOfWork.SaveChangesAsync();
        await _cacheService.RemoveAsync(CacheKeys.TopProducts);
        await _cacheService.RemoveAsync(CacheKeys.NewestProducts);
        await _cacheService.RemoveAsync(CacheKeys.FirstPageProducts);
        var response = entity.MapToProductResponse();
        _channel.Writer.TryWrite(
            new ESProductSync(
                entity.Id,
                entity.Sku,
                entity.Name,
                entity.Description,
                entity.Stock,
                entity.Brand.Name,
                entity.Category.Name,
                entity.Reviews.Count > 0 ? entity.Reviews.Average(r => r.Rating) : 0,
                entity.Price,
                entity.DiscountPrice,
                entity.ThumbnailUrl,
                entity.Tags
            )
        );
        _logger.LogInformation("Successfully created product with ID: {ProductId}", entity.Id);
        return Result<ProductResponse>.Success(response);
    }

    public async Task<Result<ProductResponse>> UpdateAsync(ProductRequest request)
    {
        _logger.LogInformation("Updating product ID: {ProductId}", request.Id);
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
            _logger.LogWarning("Product not found for update with ID: {ProductId}", request.Id);
            return Result<ProductResponse>.Failure("Sản phẩm không tồn tại");
        }

        entity = request.ApplyToProduct(entity);

        #region Update image

        if (request.IsImageEdited)
        {
            var deleteUrls = new List<string> { entity.ThumbnailUrl };
            deleteUrls.AddRange(entity.ImageUrls);
            await _storageService.DeleteBulkFromUrlAsync(deleteUrls);
            var thumbnailImage = await _imageService.OptimizeAsync(
                request.Thumbnail,
                ImageType.ProductThumbnail,
                "thumbnail"
            );
            var images = await _imageService.OptimizeBulkAsync(
                request.Images,
                ImageType.ProductDetail
            );
            var imageList = new List<IFormFile> { thumbnailImage.Value };
            imageList.AddRange(images.Value);

            var uploadResult = await _storageService.UploadBulkAsync(
                imageList,
                CommonConst.PublicBucket,
                Path.Combine(FolderUpload, entity.Sku)
            );
            var value = uploadResult.ToList();
            entity.ThumbnailUrl = value[0].Url;
            entity.ImageUrls = value.Skip(1).Select(x => x.Url).ToList();
        }

        #endregion

        _unitOfWork.GetRepository<Product>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        await _cacheService.RemoveAsync(CacheKeys.TopProducts);
        await _cacheService.RemoveAsync(CacheKeys.NewestProducts);
        await _cacheService.RemoveAsync(CacheKeys.FirstPageProducts);
        var updatedEntity = await _unitOfWork
            .GetRepository<Product>()
            .GetAll(x => x.Id == request.Id)
            .Include(x => x.Brand)
            .Include(x => x.Category)
            .Include(x => x.Reviews)
            .FirstOrDefaultAsync();
        _channel.Writer.TryWrite(
            new ESProductSync(
                updatedEntity.Id,
                updatedEntity.Sku,
                updatedEntity.Name,
                updatedEntity.Description,
                updatedEntity.Stock,
                updatedEntity.Brand.Name,
                updatedEntity.Category.Name,
                updatedEntity.Reviews.Count > 0 ? updatedEntity.Reviews.Average(r => r.Rating) : 0,
                updatedEntity.Price,
                updatedEntity.DiscountPrice,
                updatedEntity.ThumbnailUrl,
                updatedEntity.Tags
            )
        );
        var response = updatedEntity!.MapToProductResponse();
        _logger.LogInformation("Successfully updated product with ID: {ProductId}", request.Id);
        return Result<ProductResponse>.Success(response!);
    }

    public async Task<Result<string>> DeleteAsync(Guid id)
    {
        var entity = await _unitOfWork.GetRepository<Product>().GetByIdAsync(id);
        if (entity is null)
        {
            _logger.LogWarning("Product not found for deletion with ID: {ProductId}", id);
            return Result<string>.Failure("Sản phẩm không tồn tại");
        }

        entity.DeletedDate = DateTime.UtcNow;
        entity.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
        entity.IsDeleted = true;
        _unitOfWork.GetRepository<Product>().Update(entity);
        await _unitOfWork.SaveChangesAsync();
        await _cacheService.RemoveAsync(CacheKeys.TopProducts);
        await _cacheService.RemoveAsync(CacheKeys.NewestProducts);
        await _cacheService.RemoveAsync(CacheKeys.FirstPageProducts);
        _logger.LogInformation("Successfully deleted product with ID: {ProductId}", id);
        return Result<string>.Success("Xóa thành công");
    }

    public async Task<Result<string>> DeleteListAsync(List<Guid> ids)
    {
        foreach (var id in ids)
        {
            var entity = await _unitOfWork.GetRepository<Product>().GetByIdAsync(id);
            if (entity is null)
            {
                return Result<string>.Failure("Sản phẩm không tồn tại");
            }

            entity.DeletedDate = DateTime.UtcNow;
            entity.DeletedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
            entity.IsDeleted = true;
            _unitOfWork.GetRepository<Product>().Update(entity);
        }

        await _unitOfWork.SaveChangesAsync();
        await _cacheService.RemoveAsync(CacheKeys.TopProducts);
        await _cacheService.RemoveAsync(CacheKeys.NewestProducts);
        await _cacheService.RemoveAsync(CacheKeys.FirstPageProducts);
        _logger.LogInformation("Successfully deleted {Count} products", ids.Count);
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

    private static IQueryable<Product> ApplyFilterSort(IQueryable<Product> query, ProductSort sort)
    {
        return sort switch
        {
            ProductSort.Default => query,
            ProductSort.PriceAsc => query.OrderBy(x => x.Price),
            ProductSort.PriceDesc => query.OrderByDescending(x => x.Price),
            ProductSort.Newest => query.OrderByDescending(x => x.CreatedDate),
            ProductSort.Oldest => query.OrderBy(x => x.CreatedDate),
            _ => query,
        };
    }
}

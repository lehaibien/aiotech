using System.Data;
using System.Linq.Expressions;
using Application.Abstractions;
using Application.Helpers;
using Application.Images;
using Application.Products.Dtos;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.AspNetCore.Http;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Shared;

namespace Application.Products;

public class ProductService : IProductService
{
    private const string FolderUpload = "images/products";
    private readonly IUnitOfWork _unitOfWork;
    private readonly IHttpContextAccessor _contextAccessor;
    private readonly IImageService _imageService;
    private readonly IStorageService _storageService;
    private readonly ICacheService _cacheService;
    private readonly ILogger<ProductService> _logger;

    /// <summary>
    /// Initializes a new instance of the <see cref="ProductService"/> class with required dependencies for product management, caching, image processing, storage, and logging.
    /// </summary>
    public ProductService(
        IUnitOfWork unitOfWork,
        IHttpContextAccessor contextAccessor,
        IImageService imageService,
        IStorageService storageService,
        ICacheService cacheService,
        ILogger<ProductService> logger
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
    /// Retrieves a paginated list of products with optional text search and sorting.
    /// </summary>
    /// <param name="request">Pagination, search, and sorting parameters for the product list.</param>
    /// <param name="cancellationToken">Token to cancel the asynchronous operation.</param>
    /// <returns>A result containing a paginated list of product responses.</returns>
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
            .ProjectToProductResponse()
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
    /// Retrieves a paginated and filtered list of products using a stored procedure, supporting text search, price range, categories, brands, sorting, and pagination. Caches the first page of unfiltered results for 30 minutes.
    /// </summary>
    /// <param name="request">Filtering and pagination criteria for the product list.</param>
    /// <returns>A result containing the paginated list of filtered products.</returns>
    public async Task<Result<PaginatedList>> GetListFilteredAsync(
        GetListFilteredProductRequest request
    )
    {
        var isUnfilteredFirstPage =
            request.PageIndex == 0
            && string.IsNullOrEmpty(request.TextSearch)
            && request.MinPrice == 0
            && double.IsInfinity(request.MaxPrice)
            && string.IsNullOrEmpty(request.Categories)
            && string.IsNullOrEmpty(request.Brands)
            && request.Sort == ProductSort.Default;
        if (isUnfilteredFirstPage)
        {
            var cachedResult = await _cacheService.GetAsync<PaginatedList>(
                CacheKeys.FirstPageProducts
            );
            if (cachedResult != null)
            {
                return Result<PaginatedList>.Success(cachedResult);
            }
        }

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
            .GetRepository<ProductListItemResponse>()
            .ExecuteStoredProcedureAsync(StoredProcedure.GetFilteredProduct, parameters);
        var response = new PaginatedList
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = Convert.ToInt32(totalRow.Value),
            Items = result,
        };

        // Cache first page with default filters
        if (isUnfilteredFirstPage)
        {
            await _cacheService.SetAsync(
                CacheKeys.FirstPageProducts,
                response,
                TimeSpan.FromMinutes(30)
            );
        }

        return Result<PaginatedList>.Success(response);
    }

    /// <summary>
    /// Searches for products by category and name, returning a limited list of matching products.
    /// </summary>
    /// <param name="request">Search criteria including optional category, text search, and result limit.</param>
    /// <returns>A result containing a list of products matching the search criteria.</returns>
    public async Task<Result<List<ProductResponse>>> SearchAsync(SearchProductRequest request)
    {
        var result = await _unitOfWork
            .GetRepository<Product>()
            .GetAll()
            .Where(x =>
                !x.IsDeleted
                && (request.Category == null || x.Category.Name == request.Category)
                && x.Name.Contains(request.TextSearch)
            )
            .ProjectToProductResponse()
            .Take(request.SearchLimit)
            .ToListAsync();
        return Result<List<ProductResponse>>.Success(result);
    }

    /// <summary>
    /// Retrieves the top products based on total quantity sold, featured status, average review rating, and creation date, including only products with stock of at least 8.
    /// </summary>
    /// <param name="top">The maximum number of top products to return. Defaults to 12.</param>
    /// <returns>A result containing a list of top product list item responses.</returns>
    public async Task<Result<List<ProductListItemResponse>>> GetTopProductsAsync(int top = 12)
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
            .ToListAsync();
        await _cacheService.SetAsync(CacheKeys.TopProducts, result, TimeSpan.FromMinutes(30));
        return Result<List<ProductListItemResponse>>.Success(result);
    }

    /// <summary>
    /// Retrieves the newest products with stock of at least 10, ordered by creation date and average review rating.
    /// </summary>
    /// <param name="top">The maximum number of products to return. Defaults to 12.</param>
    /// <returns>A result containing a list of the newest product list item responses.</returns>
    public async Task<Result<List<ProductListItemResponse>>> GetNewestProductsAsync(int top = 12)
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
            .ToListAsync();

        await _cacheService.SetAsync(CacheKeys.NewestProducts, result, TimeSpan.FromMinutes(30));
        return Result<List<ProductListItemResponse>>.Success(result);
    }

    /// <summary>
    /// Retrieves products in the same category as the specified product, excluding the product itself.
    /// </summary>
    /// <param name="request">The request containing the product ID to find related products for.</param>
    /// <returns>A result containing a list of related product list item responses, or a failure if the product does not exist.</returns>
    public async Task<Result<List<ProductListItemResponse>>> GetRelatedProductsAsync(
        GetRelatedProductsRequest request
    )
    {
        var entity = await _unitOfWork.GetRepository<Product>().GetByIdAsync(request.Id);
        if (entity is null)
        {
            return Result<List<ProductListItemResponse>>.Failure("Sản phẩm không tồn tại");
        }

        var result = await _unitOfWork
            .GetRepository<Product>()
            .GetAll(x => x.Id != request.Id && x.CategoryId == entity.CategoryId)
            .ProjectToProductListItemResponse()
            .ToListAsync();
        return Result<List<ProductListItemResponse>>.Success(result);
    }

    /// <summary>
    /// Retrieves detailed information for a product by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the product.</param>
    /// <returns>A result containing the product details if found; otherwise, a failure result.</returns>
    public async Task<Result<ProductDetailResponse>> GetByIdAsync(Guid id)
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

    /// <summary>
    /// Retrieves a product by its ID and maps it to an update response model.
    /// </summary>
    /// <param name="id">The unique identifier of the product.</param>
    /// <returns>A result containing the product update response if found; otherwise, a failure result.</returns>
    public async Task<Result<ProductUpdateResponse>> GetRequestByIdAsync(Guid id)
    {
        var entity = await _unitOfWork
            .GetRepository<Product>()
            .GetAll()
            .FirstOrDefaultAsync(x => x.Id == id);
        if (entity is null)
        {
            return Result<ProductUpdateResponse>.Failure("Sản phẩm không tồn tại");
        }
        var response = entity.MapToProductUpdateResponse();
        return Result<ProductUpdateResponse>.Success(response);
    }

    /// <summary>
    /// Creates a new product, including image optimization and upload, and returns the created product response.
    /// </summary>
    /// <param name="request">The product data to create.</param>
    /// <returns>A result containing the created product response, or a failure if a product with the same SKU and name already exists.</returns>
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
        entity.CreatedDate = DateTime.UtcNow;
        entity.CreatedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
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
        _logger.LogInformation("Successfully created product with ID: {ProductId}", entity.Id);
        return Result<ProductResponse>.Success(response);
    }

    /// <summary>
    /// Updates an existing product with new details and images, handling duplicate checks and cache invalidation.
    /// </summary>
    /// <param name="request">The product data to update, including optional image changes.</param>
    /// <returns>A result containing the updated product response, or a failure message if the product does not exist or duplicates are found.</returns>
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
        entity.UpdatedDate = DateTime.UtcNow;
        entity.UpdatedBy = Utilities.GetUsernameFromContext(_contextAccessor.HttpContext);
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
        var response = entity.MapToProductResponse();
        _logger.LogInformation("Successfully updated product with ID: {ProductId}", request.Id);
        return Result<ProductResponse>.Success(response);
    }

    /// <summary>
    /// Marks a product as deleted by its ID and updates deletion metadata.
    /// </summary>
    /// <param name="id">The unique identifier of the product to delete.</param>
    /// <returns>A result indicating success or failure with a corresponding message.</returns>
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

    /// <summary>
    /// Marks multiple products as deleted by their IDs and updates relevant caches.
    /// </summary>
    /// <param name="ids">List of product IDs to delete.</param>
    /// <returns>A result indicating success or failure with a message.</returns>
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
}

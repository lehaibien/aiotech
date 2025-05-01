using Application.Products.Dtos;
using Application.Shared;

namespace Application.Products;

public interface IProductService
{
    Task<Result<PaginatedList<ProductResponse>>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    );

    Task<Result<PaginatedList<ProductListItemResponse>>> GetListFilteredAsync(GetListFilteredProductRequest request,
        CancellationToken cancellationToken = default);

    Task<Result<List<ProductResponse>>> SearchAsync(SearchProductRequest request,
        CancellationToken cancellationToken = default);

    Task<Result<List<ProductListItemResponse>>> GetTopProductsAsync(int top = 12,
        CancellationToken cancellationToken = default);

    Task<Result<List<ProductListItemResponse>>> GetNewestProductsAsync(int top = 12,
        CancellationToken cancellationToken = default);

    Task<Result<List<ProductListItemResponse>>> GetRelatedProductsAsync(
        GetRelatedProductsRequest request,
        CancellationToken cancellationToken = default
    );

    Task<Result<ProductDetailResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<ProductUpdateResponse>> GetRequestByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<ProductResponse>> CreateAsync(ProductRequest request);
    Task<Result<ProductResponse>> UpdateAsync(ProductRequest request);
    Task<Result<string>> DeleteAsync(Guid id);
    Task<Result<string>> DeleteListAsync(List<Guid> ids);
}
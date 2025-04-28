using Application.Products.Dtos;
using Shared;

namespace Application.Products;

public interface IProductService
{
    Task<Result<PaginatedList>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    );
    Task<Result<PaginatedList<ProductListItemResponse>>> GetListFilteredAsync(GetListFilteredProductRequest request);
    Task<Result<List<ProductResponse>>> SearchAsync(SearchProductRequest request);
    Task<Result<List<ProductListItemResponse>>> GetTopProductsAsync(int top = 12);
    Task<Result<List<ProductListItemResponse>>> GetNewestProductsAsync(int top = 12);
    Task<Result<List<ProductListItemResponse>>> GetRelatedProductsAsync(
        GetRelatedProductsRequest request
    );
    Task<Result<ProductDetailResponse>> GetByIdAsync(Guid id);
    Task<Result<ProductUpdateResponse>> GetRequestByIdAsync(Guid id);
    Task<Result<ProductResponse>> CreateAsync(ProductRequest request);
    Task<Result<ProductResponse>> UpdateAsync(ProductRequest request);
    Task<Result<string>> DeleteAsync(Guid id);
    Task<Result<string>> DeleteListAsync(List<Guid> ids);
}

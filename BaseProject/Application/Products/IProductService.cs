using Application.Products.Dtos;
using Shared;

namespace Application.Products;

public interface IProductService
{
    Task<Result<PaginatedList>> GetList(GetListProductRequest request);
    Task<Result<List<ProductResponse>>> Search(SearchProductRequest request);
    Task<Result<List<ProductResponse>>> GetTopProducts(int top = 12);
    Task<Result<List<ProductResponse>>> GetFeaturedProducts(int top = 12);
    Task<Result<List<ProductResponse>>> GetRelatedProducts(GetRelatedProductsRequest request);
    Task<Result<ProductDetailResponse>> GetById(Guid id);
    Task<Result<ProductUpdateResponse>> GetRequestById(Guid id);
    Task<Result<ProductResponse>> Create(CreateProductRequest request);
    Task<Result<ProductResponse>> Update(UpdateProductRequest request);
    Task<Result<string>> Delete(Guid id);
    Task<Result<string>> DeleteList(List<Guid> ids);
}

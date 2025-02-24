using Application.ProductCollections.Dtos;
using Shared;

namespace Application.ProductCollections;

public interface IProductCollectionService
{
    Task<Result<PaginatedList>> GetList(GetListRequest request);
    Task<Result<ProductCollectionResponse>> GetById(Guid id);
    Task<Result<ProductCollectionResponse>> Create(ProductCollectionRequest request);
    Task<Result<ProductCollectionResponse>> Update(ProductCollectionRequest request);
    Task<Result<string>> Delete(Guid id);
    Task<Result<string>> DeleteList(List<Guid> ids);
}
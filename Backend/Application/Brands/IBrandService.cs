using Application.Brands.Dtos;
using Shared;

namespace Application.Brands;

public interface IBrandService
{
    Task<Result<PaginatedList>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    );
    Task<Result<BrandResponse>> GetById(Guid id);
    Task<Result<BrandResponse>> Create(CreateBrandRequest request);
    Task<Result<BrandResponse>> Update(UpdateBrandRequest request);
    Task<Result<string>> Delete(Guid id);
    Task<Result<string>> DeleteList(List<Guid> ids);
    Task<Result<List<ComboBoxItem>>> GetComboBox();
}
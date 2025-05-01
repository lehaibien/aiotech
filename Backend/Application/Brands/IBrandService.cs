using Application.Brands.Dtos;
using Application.Shared;

namespace Application.Brands;

public interface IBrandService
{
    Task<Result<PaginatedList<BrandResponse>>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    );
    Task<Result<BrandResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<BrandResponse>> CreateAsync(BrandRequest request);
    Task<Result<BrandResponse>> UpdateAsync(BrandRequest request);
    Task<Result<string>> DeleteAsync(Guid id);
    Task<Result<string>> DeleteListAsync(List<Guid> ids);
    Task<Result<List<ComboBoxItem>>> GetComboBoxAsync(CancellationToken cancellationToken = default);
}

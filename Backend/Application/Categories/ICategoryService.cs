using Application.Categories.Dtos;
using Application.Shared;

namespace Application.Categories;

public interface ICategoryService
{
    Task<Result<PaginatedList<CategoryResponse>>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    );
    Task<Result<List<CategoryResponse>>> GetFeaturedAsync(CancellationToken cancellationToken = default);
    Task<Result<CategoryResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Result<CategoryResponse>> CreateAsync(CategoryRequest request);
    Task<Result<CategoryResponse>> UpdateAsync(CategoryRequest request);
    Task<Result<string>> DeleteAsync(Guid id);
    Task<Result<string>> DeleteListAsync(List<Guid> ids);
    Task<Result<List<ComboBoxItem>>> GetComboBoxAsync(CancellationToken cancellationToken = default);
}

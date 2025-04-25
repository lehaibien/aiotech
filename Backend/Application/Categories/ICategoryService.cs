using Application.Categories.Dtos;
using Shared;

namespace Application.Categories;

public interface ICategoryService
{
    Task<Result<PaginatedList>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    );
    Task<Result<List<CategoryResponse>>> GetFeaturedAsync();
    Task<Result<CategoryResponse>> GetByIdAsync(Guid id);
    Task<Result<CategoryResponse>> CreateAsync(CategoryRequest request);
    Task<Result<CategoryResponse>> UpdateAsync(CategoryRequest request);
    Task<Result<string>> DeleteAsync(Guid id);
    Task<Result<string>> DeleteListAsync(List<Guid> ids);
    Task<Result<List<ComboBoxItem>>> GetComboBoxAsync();
}

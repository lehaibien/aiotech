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
    Task<Result<CategoryResponse>> GetById(Guid id);
    Task<Result<CategoryResponse>> Create(CreateCategoryRequest request);
    Task<Result<CategoryResponse>> Update(UpdateCategoryRequest request);
    Task<Result<string>> Delete(Guid id);
    Task<Result<string>> DeleteList(List<Guid> ids);
    Task<Result<List<ComboBoxItem>>> GetComboBox();
}

using Application.Categories.Dtos;
using Shared;

namespace Application.Categories;

public interface ICategoryService
{
    /// <summary>
    /// Asynchronously retrieves a paginated list of categories based on the specified request parameters.
    /// </summary>
    /// <param name="request">The parameters for filtering, sorting, and paginating the category list.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>A task that represents the asynchronous operation. The task result contains a <see cref="Result{PaginatedList}"/> with the paginated category data.</returns>
    Task<Result<PaginatedList>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    );
    /// <summary>
/// Retrieves a list of featured categories.
/// </summary>
/// <returns>A task that represents the asynchronous operation. The task result contains a list of featured category responses.</returns>
Task<Result<List<CategoryResponse>>> GetFeaturedAsync();
    /// <summary>
/// Retrieves a category by its unique identifier.
/// </summary>
/// <param name="id">The unique identifier of the category.</param>
/// <returns>A result containing the category data if found.</returns>
Task<Result<CategoryResponse>> GetByIdAsync(Guid id);
    /// <summary>
/// Creates a new category using the provided request data.
/// </summary>
/// <param name="request">The data for the category to be created.</param>
/// <returns>A result containing the created category details.</returns>
Task<Result<CategoryResponse>> CreateAsync(CategoryRequest request);
    /// <summary>
/// Updates an existing category with the provided data.
/// </summary>
/// <param name="request">The category data to update.</param>
/// <returns>A result containing the updated category information.</returns>
Task<Result<CategoryResponse>> UpdateAsync(CategoryRequest request);
    /// <summary>
/// Deletes a category identified by the specified unique identifier.
/// </summary>
/// <param name="id">The unique identifier of the category to delete.</param>
/// <returns>A result containing a status message indicating the outcome of the operation.</returns>
Task<Result<string>> DeleteAsync(Guid id);
    /// <summary>
/// Deletes multiple categories identified by the provided list of unique identifiers.
/// </summary>
/// <param name="ids">A list of category IDs to delete.</param>
/// <returns>A result containing a status message indicating the outcome of the operation.</returns>
Task<Result<string>> DeleteListAsync(List<Guid> ids);
    /// <summary>
/// Retrieves a list of categories formatted as combo box items.
/// </summary>
/// <returns>A result containing a list of combo box items representing categories.</returns>
Task<Result<List<ComboBoxItem>>> GetComboBoxAsync();
}

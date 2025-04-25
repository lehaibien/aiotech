using Application.Brands.Dtos;
using Shared;

namespace Application.Brands;

public interface IBrandService
{
    /// <summary>
    /// Asynchronously retrieves a paginated list of brands based on the specified request parameters.
    /// </summary>
    /// <param name="request">The parameters for filtering, sorting, and paginating the brand list.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>A task that represents the asynchronous operation, containing the paginated list of brands.</returns>
    Task<Result<PaginatedList>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    );
    /// <summary>
/// Retrieves a brand by its unique identifier.
/// </summary>
/// <param name="id">The unique identifier of the brand.</param>
/// <returns>A task containing the result with the brand details if found.</returns>
Task<Result<BrandResponse>> GetById(Guid id);
    /// <summary>
/// Creates a new brand using the provided request data.
/// </summary>
/// <param name="request">The data required to create the brand.</param>
/// <returns>A task that represents the asynchronous operation, containing the result with the created brand's details.</returns>
Task<Result<BrandResponse>> Create(BrandRequest request);
    /// <summary>
/// Updates an existing brand with the provided data.
/// </summary>
/// <param name="request">The data used to update the brand.</param>
/// <returns>A task containing the result of the update operation, including the updated brand information.</returns>
Task<Result<BrandResponse>> Update(BrandRequest request);
    /// <summary>
/// Deletes a brand identified by the specified unique identifier.
/// </summary>
/// <param name="id">The unique identifier of the brand to delete.</param>
/// <returns>A result containing a status message indicating the outcome of the deletion.</returns>
Task<Result<string>> Delete(Guid id);
    /// <summary>
/// Deletes multiple brands identified by the provided list of unique identifiers.
/// </summary>
/// <param name="ids">A list of brand IDs to delete.</param>
/// <returns>A result containing a status message.</returns>
Task<Result<string>> DeleteList(List<Guid> ids);
    /// <summary>
/// Retrieves a list of brands formatted for use in a combo box UI element.
/// </summary>
/// <returns>A task that represents the asynchronous operation. The task result contains a list of combo box items representing brands.</returns>
Task<Result<List<ComboBoxItem>>> GetComboBox();
}

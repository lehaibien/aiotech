using Application.Products.Dtos;
using Shared;

namespace Application.Products;

public interface IProductService
{
    /// <summary>
    /// Retrieves a paginated list of products based on the specified request parameters.
    /// </summary>
    /// <param name="request">The parameters for filtering, sorting, and paginating the product list.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>A result containing the paginated list of products.</returns>
    Task<Result<PaginatedList>> GetListAsync(
        GetListRequest request,
        CancellationToken cancellationToken = default
    );
    /// <summary>
/// Retrieves a paginated list of products filtered by the specified criteria.
/// </summary>
/// <param name="request">The filtering and pagination parameters for the product list.</param>
/// <returns>A result containing the filtered and paginated list of products.</returns>
Task<Result<PaginatedList>> GetListFilteredAsync(GetListFilteredProductRequest request);
    /// <summary>
/// Searches for products matching the specified criteria.
/// </summary>
/// <param name="request">The search parameters to filter products.</param>
/// <returns>A result containing a list of products that match the search criteria.</returns>
Task<Result<List<ProductResponse>>> SearchAsync(SearchProductRequest request);
    /// <summary>
/// Retrieves a list of the top products, limited to the specified number.
/// </summary>
/// <param name="top">The maximum number of top products to return. Defaults to 12.</param>
/// <returns>A result containing a list of top product items.</returns>
Task<Result<List<ProductListItemResponse>>> GetTopProductsAsync(int top = 12);
    /// <summary>
/// Retrieves a list of the newest products, limited to the specified number.
/// </summary>
/// <param name="top">The maximum number of newest products to return. Defaults to 12.</param>
/// <returns>A result containing a list of the newest product list item responses.</returns>
Task<Result<List<ProductListItemResponse>>> GetNewestProductsAsync(int top = 12);
    /// <summary>
    /// Retrieves a list of products related to the specified product.
    /// </summary>
    /// <param name="request">The criteria for determining related products.</param>
    /// <returns>A result containing a list of related product items.</returns>
    Task<Result<List<ProductListItemResponse>>> GetRelatedProductsAsync(
        GetRelatedProductsRequest request
    );
    /// <summary>
/// Retrieves detailed information for a product by its unique identifier.
/// </summary>
/// <param name="id">The unique identifier of the product.</param>
/// <returns>A result containing the product's detailed information if found.</returns>
Task<Result<ProductDetailResponse>> GetByIdAsync(Guid id);
    /// <summary>
/// Retrieves the product update request details for the specified product ID.
/// </summary>
/// <param name="id">The unique identifier of the product.</param>
/// <returns>A result containing the product update request details.</returns>
Task<Result<ProductUpdateResponse>> GetRequestByIdAsync(Guid id);
    /// <summary>
/// Creates a new product using the provided product data.
/// </summary>
/// <param name="request">The product information to be created.</param>
/// <returns>A result containing the created product details.</returns>
Task<Result<ProductResponse>> CreateAsync(ProductRequest request);
    /// <summary>
/// Updates an existing product with the provided data.
/// </summary>
/// <param name="request">The product data to update.</param>
/// <returns>A result containing the updated product information.</returns>
Task<Result<ProductResponse>> UpdateAsync(ProductRequest request);
    /// <summary>
/// Deletes a product identified by its unique identifier.
/// </summary>
/// <param name="id">The unique identifier of the product to delete.</param>
/// <returns>A result containing a status message indicating the outcome of the deletion.</returns>
Task<Result<string>> DeleteAsync(Guid id);
    /// <summary>
/// Deletes multiple products identified by their unique identifiers.
/// </summary>
/// <param name="ids">A list of product IDs to delete.</param>
/// <returns>A result containing a status message indicating the outcome of the deletion.</returns>
Task<Result<string>> DeleteListAsync(List<Guid> ids);
}

using Application.Products;
using Application.Products.Dtos;
using Microsoft.AspNetCore.Mvc;
using Shared;
using WebApi.Extensions;

namespace WebApi.Controllers;

[Route("[controller]")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly IProductService _service;

    public ProductController(IProductService service)
    {
        _service = service;
    }

    /// <summary>
    /// Retrieves a list of products based on the specified query parameters.
    /// </summary>
    /// <param name="request">Query parameters for filtering and pagination.</param>
    /// <returns>An HTTP response containing the list of products.</returns>
    [HttpGet]
    public async Task<IActionResult> GetListAsync([FromQuery] GetListRequest request)
    {
        var result = await _service.GetListAsync(request);
        return this.FromResult(result);
    }

    /// <summary>
    /// Retrieves a filtered list of products based on the specified filter criteria.
    /// </summary>
    /// <param name="request">The filter parameters for retrieving products.</param>
    /// <returns>An HTTP response containing the filtered list of products.</returns>
    [HttpGet("filtered")]
    public async Task<IActionResult> GetListFilteredAsync(
        [FromQuery] GetListFilteredProductRequest request
    )
    {
        var result = await _service.GetListFilteredAsync(request);
        return this.FromResult(result);
    }

    /// <summary>
    /// Searches for products based on the specified search criteria.
    /// </summary>
    /// <param name="request">The search parameters to filter products.</param>
    /// <returns>An HTTP response containing the search results.</returns>
    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] SearchProductRequest request)
    {
        var result = await _service.SearchAsync(request);
        return this.FromResult(result);
    }

    /// <summary>
    /// Retrieves the top products based on the specified count.
    /// </summary>
    /// <param name="count">The number of top products to return. Defaults to 8 if not specified.</param>
    /// <returns>An HTTP response containing the list of top products.</returns>
    [HttpGet("top")]
    public async Task<IActionResult> GetTopProducts([FromQuery] int count = 8)
    {
        var result = await _service.GetTopProductsAsync(count);
        return this.FromResult(result);
    }

    /// <summary>
    /// Retrieves the newest products, limited to the specified count.
    /// </summary>
    /// <param name="count">The maximum number of newest products to return. Defaults to 8.</param>
    /// <returns>An HTTP response containing the newest products.</returns>
    [HttpGet("newest")]
    public async Task<IActionResult> GetNewestProducts([FromQuery] int count = 8)
    {
        var result = await _service.GetNewestProductsAsync(count);
        return this.FromResult(result);
    }

    /// <summary>
    /// Retrieves a list of products related to the specified criteria.
    /// </summary>
    /// <param name="request">The criteria for finding related products.</param>
    /// <returns>An HTTP response containing the related products.</returns>
    [HttpGet("related")]
    public async Task<IActionResult> GetRelatedProducts(
        [FromQuery] GetRelatedProductsRequest request
    )
    {
        var result = await _service.GetRelatedProductsAsync(request);
        return this.FromResult(result);
    }

    /// <summary>
    /// Retrieves a product by its unique identifier.
    /// </summary>
    /// <param name="id">The GUID of the product to retrieve.</param>
    /// <returns>An HTTP response containing the product details if found.</returns>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return this.FromResult(result);
    }

    /// <summary>
    /// Retrieves a product request by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the product request.</param>
    /// <returns>The product request details if found; otherwise, an appropriate HTTP response.</returns>
    [HttpGet("request/{id:guid}")]
    public async Task<IActionResult> GetRequestById(Guid id)
    {
        var result = await _service.GetRequestByIdAsync(id);
        return this.FromResult(result);
    }

    /// <summary>
    /// Creates a new product using the provided request data.
    /// </summary>
    /// <param name="request">The product information to create.</param>
    /// <returns>An HTTP response indicating the result of the creation operation.</returns>
    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromForm] ProductRequest request)
    {
        var result = await _service.CreateAsync(request);
        return this.FromResult(result);
    }

    /// <summary>
    /// Updates an existing product with the provided information.
    /// </summary>
    /// <param name="request">The product data to update.</param>
    /// <returns>An HTTP response indicating the outcome of the update operation.</returns>
    [HttpPut]
    public async Task<IActionResult> UpdateAsync([FromForm] ProductRequest request)
    {
        var result = await _service.UpdateAsync(request);
        return this.FromResult(result);
    }

    /// <summary>
    /// Deletes a product by its unique identifier.
    /// </summary>
    /// <param name="id">The GUID of the product to delete.</param>
    /// <returns>An HTTP response indicating the result of the delete operation.</returns>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _service.DeleteAsync(id);
        return this.FromResult(result);
    }

    /// <summary>
    /// Deletes multiple products identified by their IDs.
    /// </summary>
    /// <param name="ids">A list of product IDs to delete.</param>
    /// <returns>An HTTP response indicating the result of the delete operation.</returns>
    [HttpDelete]
    public async Task<IActionResult> DeleteList(List<Guid> ids)
    {
        var result = await _service.DeleteListAsync(ids);
        return this.FromResult(result);
    }
}

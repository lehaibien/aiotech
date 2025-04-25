using Application.Categories;
using Application.Categories.Dtos;
using Microsoft.AspNetCore.Mvc;
using Shared;
using WebApi.Extensions;

namespace WebApi.Controllers;

[Route("[controller]")]
[ApiController]
public class CategoryController : ControllerBase
{
    private readonly ICategoryService _service;

    /// <summary>
    /// Initializes a new instance of the <see cref="CategoryController"/> class with the specified category service.
    /// </summary>
    public CategoryController(ICategoryService service)
    {
        _service = service;
    }

    /// <summary>
    /// Retrieves a list of categories based on the specified query parameters.
    /// </summary>
    /// <param name="request">Query parameters for filtering and pagination.</param>
    /// <returns>An HTTP response containing the list of categories.</returns>
    [HttpGet]
    public async Task<IActionResult> GetListAsync([FromQuery] GetListRequest request)
    {
        var result = await _service.GetListAsync(request);
        return this.FromResult(result);
    }

    /// <summary>
    /// Retrieves a list of featured categories.
    /// </summary>
    /// <returns>An HTTP response containing the featured categories.</returns>
    [HttpGet("featured")]
    public async Task<IActionResult> GetFeaturedAsync()
    {
        var result = await _service.GetFeaturedAsync();
        return this.FromResult(result);
    }

    /// <summary>
    /// Retrieves a category by its unique identifier.
    /// </summary>
    /// <param name="id">The GUID of the category to retrieve.</param>
    /// <returns>An HTTP response containing the category data if found.</returns>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetByIdAsync(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return this.FromResult(result);
    }

    /// <summary>
    /// Creates a new category using the provided request data.
    /// </summary>
    /// <param name="request">The category details to create.</param>
    /// <returns>An HTTP response indicating the result of the creation operation.</returns>
    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromForm] CategoryRequest request)
    {
        var result = await _service.CreateAsync(request);
        return this.FromResult(result);
    }

    /// <summary>
    /// Updates an existing category with the provided data.
    /// </summary>
    /// <param name="request">The updated category information.</param>
    /// <returns>An HTTP response indicating the result of the update operation.</returns>
    [HttpPut]
    public async Task<IActionResult> UpdateAsync([FromForm] CategoryRequest request)
    {
        var result = await _service.UpdateAsync(request);
        return this.FromResult(result);
    }

    /// <summary>
    /// Deletes a category by its unique identifier.
    /// </summary>
    /// <param name="id">The GUID of the category to delete.</param>
    /// <returns>An HTTP response indicating the result of the delete operation.</returns>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id)
    {
        var result = await _service.DeleteAsync(id);
        return this.FromResult(result);
    }

    /// <summary>
    /// Deletes multiple categories identified by their GUIDs.
    /// </summary>
    /// <param name="ids">A list of category GUIDs to delete.</param>
    /// <returns>An HTTP response indicating the result of the delete operation.</returns>
    [HttpDelete]
    public async Task<IActionResult> DeleteListAsync(List<Guid> ids)
    {
        var result = await _service.DeleteListAsync(ids);
        return this.FromResult(result);
    }

    /// <summary>
    /// Retrieves a list of categories formatted for use in a combo box UI element.
    /// </summary>
    /// <returns>An HTTP response containing combo box data for categories.</returns>
    [HttpGet("combo-box")]
    public async Task<IActionResult> GetComboBoxAsync()
    {
        var result = await _service.GetComboBoxAsync();
        return this.FromResult(result);
    }
}

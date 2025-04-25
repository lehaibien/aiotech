using Application.Brands;
using Application.Brands.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared;
using WebApi.Extensions;
using WebApi.Model;

namespace WebApi.Controllers;

[Route("[controller]")]
[ApiController]
public class BrandController : ControllerBase
{
    private readonly IBrandService _service;
    private readonly ILogger<BrandController> _logger;

    public BrandController(IBrandService service, ILogger<BrandController> logger)
    {
        _service = service;
        _logger = logger;
    }

    /// <summary>
    /// Retrieves a list of brands based on the specified query parameters.
    /// </summary>
    /// <param name="request">Query parameters for filtering and pagination.</param>
    /// <returns>An HTTP response containing the list of brands.</returns>
    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] GetListRequest request)
    {
        var result = await _service.GetListAsync(request);
        return this.FromResult(result);
    }

    /// <summary>
    /// Retrieves a brand by its unique identifier.
    /// </summary>
    /// <param name="id">The GUID of the brand to retrieve.</param>
    /// <returns>An IActionResult containing the brand data if found, or an appropriate error response.</returns>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetById(id);
        return this.FromResult(result);
    }

    /// <summary>
    /// Creates a new brand using the provided request data.
    /// </summary>
    /// <param name="request">The brand information to create.</param>
    /// <returns>An IActionResult containing the result of the creation operation.</returns>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromForm] BrandRequest request)
    {
        var result = await _service.Create(request);
        _logger.LogInformation("A brand with name {Name} has been created", request.Name);
        return this.FromResult(result);
    }

    /// <summary>
    /// Updates an existing brand with the provided information.
    /// </summary>
    /// <param name="request">The updated brand data.</param>
    /// <returns>An IActionResult containing the update operation result.</returns>
    [HttpPut]
    [Authorize(Policy = "Admin")]
    public async Task<IActionResult> Update([FromForm] BrandRequest request)
    {
        var result = await _service.Update(request);
        _logger.LogInformation(
            "A brand with id {Id} and name {Name} has been updated",
            request.Id,
            request.Name
        );
        return this.FromResult(result);
    }

    /// <summary>
    /// Deletes a brand by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the brand to delete.</param>
    /// <returns>An IActionResult indicating the outcome of the deletion.</returns>
    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _service.Delete(id);
        _logger.LogInformation("A brand with Id {Id} has been deleted.", id);
        return this.FromResult(result);
    }

    /// <summary>
    /// Deletes multiple brands by their IDs.
    /// </summary>
    /// <param name="ids">A list of brand IDs to delete.</param>
    /// <returns>An IActionResult indicating the outcome of the deletion operation.</returns>
    [HttpDelete]
    [Authorize(Policy = "Admin")]
    public async Task<IActionResult> DeleteList(List<Guid> ids)
    {
        var result = await _service.DeleteList(ids);
        _logger.LogInformation("A list of brand has been deleted. Ids: {Id}", ids);
        return this.FromResult(result);
    }

    /// <summary>
    /// Retrieves a list of brands formatted for use in a combo box UI element.
    /// </summary>
    /// <returns>An <see cref="IActionResult"/> containing the combo box data.</returns>
    [HttpGet("combo-box")]
    public async Task<IActionResult> GetComboBox()
    {
        var result = await _service.GetComboBox();
        return this.FromResult(result);
    }
}

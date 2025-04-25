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

    public CategoryController(ICategoryService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetListAsync([FromQuery] GetListRequest request)
    {
        var result = await _service.GetListAsync(request);
        return this.FromResult(result);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeaturedAsync()
    {
        var result = await _service.GetFeaturedAsync();
        return this.FromResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetByIdAsync(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return this.FromResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromForm] CategoryRequest request)
    {
        var result = await _service.CreateAsync(request);
        return this.FromResult(result);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateAsync([FromForm] CategoryRequest request)
    {
        var result = await _service.UpdateAsync(request);
        return this.FromResult(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id)
    {
        var result = await _service.DeleteAsync(id);
        return this.FromResult(result);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteListAsync(List<Guid> ids)
    {
        var result = await _service.DeleteListAsync(ids);
        return this.FromResult(result);
    }

    [HttpGet("combo-box")]
    public async Task<IActionResult> GetComboBoxAsync()
    {
        var result = await _service.GetComboBoxAsync();
        return this.FromResult(result);
    }
}

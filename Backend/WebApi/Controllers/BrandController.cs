using Application.Brands;
using Application.Brands.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.Shared;
using WebApi.Extensions;

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

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] GetListRequest request)
    {
        var result = await _service.GetListAsync(request);
        return this.FromResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return this.FromResult(result);
    }

    [HttpPost]
    [Authorize(Policy = "Admin")]
    public async Task<IActionResult> Create([FromForm] BrandRequest request)
    {
        var result = await _service.CreateAsync(request);
        _logger.LogInformation("A brand with name {Name} has been created", request.Name);
        return this.FromResult(result);
    }

    [HttpPut]
    [Authorize(Policy = "Admin")]
    public async Task<IActionResult> Update([FromForm] BrandRequest request)
    {
        var result = await _service.UpdateAsync(request);
        _logger.LogInformation(
            "A brand with id {Id} and name {Name} has been updated",
            request.Id,
            request.Name
        );
        return this.FromResult(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Policy = "Admin")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _service.DeleteAsync(id);
        _logger.LogInformation("A brand with Id {Id} has been deleted.", id);
        return this.FromResult(result);
    }

    [HttpDelete]
    [Authorize(Policy = "Admin")]
    public async Task<IActionResult> DeleteList(List<Guid> ids)
    {
        var result = await _service.DeleteListAsync(ids);
        _logger.LogInformation("A list of brand has been deleted. Ids: {Id}", ids);
        return this.FromResult(result);
    }

    [HttpGet("combo-box")]
    public async Task<IActionResult> GetComboBox()
    {
        var result = await _service.GetComboBoxAsync();
        return this.FromResult(result);
    }
}

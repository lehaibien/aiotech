using Application.Products;
using Application.Products.Dtos;
using Microsoft.AspNetCore.Mvc;
using Application.Shared;
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

    [HttpGet]
    public async Task<IActionResult> GetListAsync([FromQuery] GetListRequest request)
    {
        var result = await _service.GetListAsync(request);
        return this.FromResult(result);
    }

    [HttpGet("filtered")]
    public async Task<IActionResult> GetListFilteredAsync(
        [FromQuery] GetListFilteredProductRequest request
    )
    {
        var result = await _service.GetListFilteredAsync(request);
        return this.FromResult(result);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] SearchProductRequest request)
    {
        var result = await _service.SearchAsync(request);
        return this.FromResult(result);
    }

    [HttpGet("top")]
    public async Task<IActionResult> GetTopProducts([FromQuery] int count = 8)
    {
        var result = await _service.GetTopProductsAsync(count);
        return this.FromResult(result);
    }

    [HttpGet("newest")]
    public async Task<IActionResult> GetNewestProducts([FromQuery] int count = 8)
    {
        var result = await _service.GetNewestProductsAsync(count);
        return this.FromResult(result);
    }

    [HttpGet("related")]
    public async Task<IActionResult> GetRelatedProducts(
        [FromQuery] GetRelatedProductsRequest request
    )
    {
        var result = await _service.GetRelatedProductsAsync(request);
        return this.FromResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return this.FromResult(result);
    }

    [HttpGet("request/{id:guid}")]
    public async Task<IActionResult> GetRequestById(Guid id)
    {
        var result = await _service.GetRequestByIdAsync(id);
        return this.FromResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromForm] ProductRequest request)
    {
        var result = await _service.CreateAsync(request);
        return this.FromResult(result);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateAsync([FromForm] ProductRequest request)
    {
        var result = await _service.UpdateAsync(request);
        return this.FromResult(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var result = await _service.DeleteAsync(id);
        return this.FromResult(result);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteList(List<Guid> ids)
    {
        var result = await _service.DeleteListAsync(ids);
        return this.FromResult(result);
    }
}

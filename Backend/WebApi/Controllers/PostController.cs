using Application.Posts;
using Application.Posts.Dtos;
using Application.Shared;
using Microsoft.AspNetCore.Mvc;
using WebApi.Extensions;

namespace WebApi.Controllers;

[Route("[controller]")]
[ApiController]
public class PostController : ControllerBase
{
    private readonly IPostService _service;

    public PostController(IPostService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetListAsync([FromQuery] GetListRequest request)
    {
        var result = await _service.GetListAsync(request);
        return this.FromResult(result);
    }

    [HttpGet("preview")]
    public async Task<IActionResult> GetPostPreviewAsync([FromQuery] GetListRequest request)
    {
        var result = await _service.GetListItemAsync(request);
        return this.FromResult(result);
    }

    [HttpGet("{id:guid}/related")]
    public async Task<IActionResult> GetRelatedPostAsync(Guid id)
    {
        var result = await _service.GetRelatedPostAsync(id);
        return this.FromResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetByIdAsync(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return this.FromResult(result);
    }

    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlugAsync(string slug)
    {
        var result = await _service.GetBySlugAsync(slug);
        return this.FromResult(result);
    }

    [HttpGet("{id:guid}/update")]
    public async Task<IActionResult> GetForUpdateAsync(Guid id)
    {
        var result = await _service.GetForUpdateAsync(id);
        return this.FromResult(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromForm] PostRequest request)
    {
        var result = await _service.CreateAsync(request);
        return this.FromResult(result);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateAsync([FromForm] PostRequest request)
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
}

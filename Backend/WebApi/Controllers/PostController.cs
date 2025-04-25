using Application.Posts;
using Application.Posts.Dtos;
using Microsoft.AspNetCore.Mvc;
using Shared;
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

    /// <summary>
    /// Retrieves a list of posts based on the specified query parameters.
    /// </summary>
    /// <param name="request">Query parameters for filtering and pagination.</param>
    /// <returns>An HTTP response containing the list of posts.</returns>
    [HttpGet]
    public async Task<IActionResult> GetListAsync([FromQuery] GetListRequest request)
    {
        var result = await _service.GetListAsync(request);
        return this.FromResult(result);
    }

    /// <summary>
    /// Retrieves a preview list of posts based on the specified query parameters.
    /// </summary>
    /// <param name="request">Query parameters for filtering and paging the post previews.</param>
    /// <returns>An action result containing the preview list of posts.</returns>
    [HttpGet("preview")]
    public async Task<IActionResult> GetPostPreviewAsync([FromQuery] GetListRequest request)
    {
        var result = await _service.GetListItemAsync(request);
        return this.FromResult(result);
    }

    /// <summary>
    /// Retrieves posts related to the specified post ID.
    /// </summary>
    /// <param name="id">The unique identifier of the post for which related posts are requested.</param>
    /// <returns>An HTTP response containing the list of related posts.</returns>
    [HttpGet("{id:guid}/related")]
    public async Task<IActionResult> GetRelatedPostAsync(Guid id)
    {
        var result = await _service.GetRelatedPostAsync(id);
        return this.FromResult(result);
    }

    /// <summary>
    /// Retrieves a post by its unique identifier.
    /// </summary>
    /// <param name="id">The GUID of the post to retrieve.</param>
    /// <returns>An IActionResult containing the post data if found.</returns>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetByIdAsync(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return this.FromResult(result);
    }

    /// <summary>
    /// Retrieves a post by its slug.
    /// </summary>
    /// <param name="slug">The unique slug identifier of the post.</param>
    /// <returns>The post matching the specified slug, or a not found result if no match exists.</returns>
    [HttpGet("slug/{slug}")]
    public async Task<IActionResult> GetBySlugAsync(string slug)
    {
        var result = await _service.GetBySlugAsync(slug);
        return this.FromResult(result);
    }

    /// <summary>
    /// Creates a new post using the provided form data.
    /// </summary>
    /// <param name="request">The post data submitted via form.</param>
    /// <returns>The result of the post creation operation.</returns>
    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromForm] PostRequest request)
    {
        var result = await _service.CreateAsync(request);
        return this.FromResult(result);
    }

    /// <summary>
    /// Updates an existing post with the provided data.
    /// </summary>
    /// <param name="request">The post data to update, submitted via form.</param>
    /// <returns>An IActionResult containing the update operation result.</returns>
    [HttpPut]
    public async Task<IActionResult> UpdateAsync([FromForm] PostRequest request)
    {
        var result = await _service.UpdateAsync(request);
        return this.FromResult(result);
    }

    /// <summary>
    /// Deletes a post by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the post to delete.</param>
    /// <returns>An IActionResult indicating the outcome of the delete operation.</returns>
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id)
    {
        var result = await _service.DeleteAsync(id);
        return this.FromResult(result);
    }

    /// <summary>
    /// Deletes multiple posts identified by their unique IDs.
    /// </summary>
    /// <param name="ids">A list of GUIDs representing the posts to delete.</param>
    /// <returns>An IActionResult indicating the outcome of the delete operation.</returns>
    [HttpDelete]
    public async Task<IActionResult> DeleteListAsync(List<Guid> ids)
    {
        var result = await _service.DeleteListAsync(ids);
        return this.FromResult(result);
    }
}

using Application.Posts;
using Application.Posts.Dtos;
using Microsoft.AspNetCore.Mvc;
using Shared;
using WebApi.Model;

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
        var response = new ApiResponse();
        var result = await _service.GetListAsync(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Data;
        return Ok(response);
    }

    [HttpGet("preview")]
    public async Task<IActionResult> GetPostPreviewAsync([FromQuery] GetListRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.GetPostPreviewAsync(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Data;
        return Ok(response);
    }

    [HttpGet("{id:guid}/related")]
    public async Task<IActionResult> GetRelatedPostAsync(Guid id)
    {
        var response = new ApiResponse();
        var result = await _service.GetRelatedPostAsync(id);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Data;
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetByIdAsync(Guid id)
    {
        var response = new ApiResponse();
        var result = await _service.GetByIdAsync(id);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Data;
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> CreateAsync([FromForm] CreatePostRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.CreateAsync(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Data;
        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateAsync([FromForm] UpdatePostRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.UpdateAsync(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Data;
        return Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id)
    {
        var response = new ApiResponse();
        var result = await _service.DeleteAsync(id);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Data;
        return Ok(response);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteListAsync(List<Guid> ids)
    {
        var response = new ApiResponse();
        var result = await _service.DeleteListAsync(ids);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Data;
        return Ok(response);
    }
}

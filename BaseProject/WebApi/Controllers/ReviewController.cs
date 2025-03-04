using Application.Reviews;
using Application.Reviews.Dtos;
using Microsoft.AspNetCore.Mvc;
using Shared;
using WebApi.Model;

namespace WebApi.Controllers;

[Route("[controller]")]
[ApiController]
public class ReviewController : ControllerBase
{
    private readonly IReviewService _service;

    public ReviewController(IReviewService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] GetListRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.GetList(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Data;
        return Ok(response);
    }

    [HttpGet("product")]
    public async Task<IActionResult> GetByProductId(
        [FromQuery] GetListReviewByProductIdRequest request
    )
    {
        var response = new ApiResponse();
        var result = await _service.GetByProductId(request);
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
    public async Task<IActionResult> GetById(Guid id)
    {
        var response = new ApiResponse();
        var result = await _service.GetById(id);
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
    public async Task<IActionResult> Create(CreateReviewRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.Create(request);
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
    public async Task<IActionResult> Update(UpdateReviewRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.Update(request);
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
    public async Task<IActionResult> Delete(Guid id)
    {
        var response = new ApiResponse();
        var result = await _service.Delete(id);
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
    public async Task<IActionResult> DeleteList(List<Guid> ids)
    {
        var response = new ApiResponse();
        var result = await _service.DeleteList(ids);
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

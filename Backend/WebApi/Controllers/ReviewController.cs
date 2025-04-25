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

    /// <summary>
    /// Retrieves a list of reviews based on the specified query parameters.
    /// </summary>
    /// <param name="request">The query parameters for filtering and paging the review list.</param>
    /// <returns>An HTTP response containing the list of reviews or an error message.</returns>
    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] GetListRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.GetListAsync(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Value;
        return Ok(response);
    }

    /// <summary>
    /// Retrieves a list of reviews for a specified product.
    /// </summary>
    /// <param name="request">The request containing the product ID and optional filtering parameters.</param>
    /// <returns>An API response containing the list of reviews or an error message.</returns>
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

        response.Data = result.Value;
        return Ok(response);
    }

    /// <summary>
    /// Retrieves a review by its unique identifier.
    /// </summary>
    /// <param name="id">The GUID of the review to retrieve.</param>
    /// <returns>An HTTP 200 response with the review data if found; otherwise, an HTTP 400 response with an error message.</returns>
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
        response.Data = result.Value;
        return Ok(response);
    }

    /// <summary>
    /// Creates a new review using the provided request data.
    /// </summary>
    /// <param name="request">The details of the review to create.</param>
    /// <returns>An API response containing the created review data on success, or an error message on failure.</returns>
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
        response.Data = result.Value;
        return Ok(response);
    }

    /// <summary>
    /// Updates an existing review with the provided information.
    /// </summary>
    /// <param name="request">The update details for the review.</param>
    /// <returns>An HTTP response containing the updated review data if successful, or an error message if the update fails.</returns>
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
        response.Data = result.Value;
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
        return Ok(response);
    }

    /// <summary>
    /// Deletes multiple reviews identified by their GUIDs.
    /// </summary>
    /// <param name="ids">A list of GUIDs representing the reviews to delete.</param>
    /// <returns>An HTTP response indicating the result of the deletion operation.</returns>
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
        response.Data = result.Value;
        return Ok(response);
    }
}

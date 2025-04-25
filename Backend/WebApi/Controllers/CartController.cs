using Application.Carts;
using Application.Carts.Dtos;
using Microsoft.AspNetCore.Mvc;
using Shared;
using WebApi.Model;

namespace WebApi.Controllers;

[Route("[controller]")]
[ApiController]
public class CartController : ControllerBase
{
    private readonly ICartService _service;

    public CartController(ICartService service)
    {
        _service = service;
    }

    /// <summary>
    /// Retrieves the shopping cart associated with the specified user ID.
    /// </summary>
    /// <param name="id">The unique identifier of the user.</param>
    /// <returns>An HTTP response containing the user's cart data if found; otherwise, a failure message.</returns>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetByUserId(Guid id)
    {
        var response = new ApiResponse();
        var result = await _service.GetCartByUserId(id);
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
    /// Adds items to the user's shopping cart.
    /// </summary>
    /// <param name="request">The cart request containing items to add.</param>
    /// <returns>An API response with the updated cart data or an error message.</returns>
    [HttpPost]
    public async Task<IActionResult> AddToCart([FromBody] CartRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.AddToCart(request);
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
    /// Removes an item from the user's shopping cart.
    /// </summary>
    /// <param name="request">The details of the item to remove from the cart.</param>
    /// <returns>An IActionResult containing the updated cart data on success, or a failure response if the operation fails.</returns>
    [HttpPut]
    public async Task<IActionResult> RemoveFromCart([FromBody] CartRemoveItemRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.RemoveFromCart(request);
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
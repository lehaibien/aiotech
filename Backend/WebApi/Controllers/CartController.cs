using Application.Carts;
using Application.Carts.Dtos;
using Microsoft.AspNetCore.Mvc;
using Application.Shared;
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

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetByUserId(Guid id)
    {
        var response = new ApiResponse();
        var result = await _service.GetCartByUserIdAsync(id);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Value;
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> AddToCart([FromBody] CartRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.AddToCartAsync(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Value;
        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> RemoveFromCart([FromBody] CartRemoveItemRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.RemoveFromCartAsync(request);
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
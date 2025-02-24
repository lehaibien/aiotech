using Application.Carts;
using Application.Carts.Dtos;
using Microsoft.AspNetCore.Mvc;
using Shared;
using WebApi.Model;

namespace WebApi.Controllers;

[Route("api/[controller]")]
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
        var result = await _service.GetCartByUserId(id);
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

        response.Data = result.Data;
        return Ok(response);
    }

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

        response.Data = result.Data;
        return Ok(response);
    }
}
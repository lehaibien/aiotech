using Application.Wishlist;
using Application.Wishlist.Dtos;
using Microsoft.AspNetCore.Mvc;
using WebApi.Model;

namespace WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class WishlistController : ControllerBase
{
    private readonly IWishlistService _wishlistService;
    public WishlistController(IWishlistService wishlistService)
    {
        _wishlistService = wishlistService;
    }

    [HttpGet("{userId:guid}")]
    public async Task<IActionResult> GetWishlistItems(Guid userId)
    {
        var response = new ApiResponse();
        var result = await _wishlistService.GetWishlistAsync(userId);
        if(result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Value;
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> AddToWishlist([FromBody] WishlistItemRequest request)
    {
        var response = new ApiResponse();
        var result = await _wishlistService.AddItemToWishlistAsync(request);
        if(result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Value;
        return Ok(response);
    }

    [HttpDelete]
    public async Task<IActionResult> RemoveFromWishlist([FromBody] WishlistItemRequest request)
    {
        var response = new ApiResponse();
        var result = await _wishlistService.RemoveItemFromWishlistAsync(request);
        if(result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpDelete("{userId:guid}/clear")]
    public async Task<IActionResult> ClearWishlist(Guid userId)
    {
        var response = new ApiResponse();
        var result = await _wishlistService.ClearWishlistAsync(userId);
        if(result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        return Ok(response);
    }
}
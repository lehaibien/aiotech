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
    /// <summary>
    /// Initializes a new instance of the <see cref="WishlistController"/> with the specified wishlist service.
    /// </summary>
    public WishlistController(IWishlistService wishlistService)
    {
        _wishlistService = wishlistService;
    }

    /// <summary>
    /// Retrieves the wishlist items for the specified user.
    /// </summary>
    /// <param name="userId">The unique identifier of the user whose wishlist is to be retrieved.</param>
    /// <returns>An <see cref="IActionResult"/> containing the wishlist items on success, or an error message on failure.</returns>
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

    /// <summary>
    /// Adds an item to the user's wishlist.
    /// </summary>
    /// <param name="request">The wishlist item details to add.</param>
    /// <returns>An <see cref="IActionResult"/> containing the result of the add operation.</returns>
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

    /// <summary>
    /// Removes a specified item from the user's wishlist.
    /// </summary>
    /// <param name="request">The wishlist item to remove.</param>
    /// <returns>An IActionResult indicating success or failure of the removal operation.</returns>
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

    /// <summary>
    /// Removes all items from the wishlist for the specified user.
    /// </summary>
    /// <param name="userId">The unique identifier of the user whose wishlist will be cleared.</param>
    /// <returns>An HTTP response indicating the success or failure of the operation.</returns>
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
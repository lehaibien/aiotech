using Application.Users;
using Application.Users.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared;
using WebApi.Extensions;

namespace WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _service;

    /// <summary>
    /// Initializes a new instance of the <see cref="UserController"/> with the specified user service.
    /// </summary>
    public UserController(IUserService service)
    {
        _service = service;
    }

    /// <summary>
    /// Retrieves a list of users based on the specified query parameters.
    /// </summary>
    /// <param name="request">Query parameters for filtering and paging the user list.</param>
    /// <returns>An IActionResult containing the list of users or an appropriate error response.</returns>
    [HttpGet]
    public async Task<IActionResult> GetListAsync([FromQuery] GetListRequest request)
    {
        var result = await _service.GetListAsync(request);
        return this.FromResult(result);
    }

    /// <summary>
    /// Retrieves a user by their unique identifier.
    /// </summary>
    /// <param name="id">The GUID of the user to retrieve.</param>
    /// <returns>An IActionResult containing the user data if found, or an appropriate error response.</returns>
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetByIdAsync(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return this.FromResult(result);
    }

    /// <summary>
    /// Retrieves the profile information for a user by their unique identifier.
    /// </summary>
    /// <param name="id">The GUID of the user whose profile is to be retrieved.</param>
    /// <returns>An IActionResult containing the user's profile data or an appropriate error response.</returns>
    [HttpGet("{id:guid}/profile")]
    public async Task<IActionResult> GetUserProfileByIdAsync(Guid id)
    {
        var result = await _service.GetProfileByIdAsync(id);
        return this.FromResult(result);
    }

    /// <summary>
    /// Creates a new user with the provided information. Requires "Admin" role authorization.
    /// </summary>
    /// <param name="request">The user data to create the new user.</param>
    /// <returns>An IActionResult containing the result of the creation operation.</returns>
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateAsync([FromForm] UserRequest request)
    {
        var result = await _service.CreateAsync(request);
        return this.FromResult(result);
    }

    /// <summary>
    /// Updates an existing user's information.
    /// </summary>
    /// <param name="request">The updated user data.</param>
    /// <returns>An IActionResult containing the update operation result.</returns>
    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAsync([FromForm] UserRequest request)
    {
        var result = await _service.UpdateAsync(request);
        return this.FromResult(result);
    }

    /// <summary>
    /// Updates the profile information of a user.
    /// </summary>
    /// <param name="request">The profile data to update.</param>
    /// <returns>An IActionResult containing the result of the profile update operation.</returns>
    [HttpPost("profile")]
    public async Task<IActionResult> ChangeProfileAsync([FromForm] UserProfileRequest request)
    {
        var result = await _service.UpdateProfileAsync(request);
        return this.FromResult(result);
    }

    /// <summary>
    /// Deletes a user by their unique identifier.
    /// </summary>
    /// <param name="id">The GUID of the user to delete.</param>
    /// <returns>An IActionResult indicating the outcome of the delete operation.</returns>
    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAsync(Guid id)
    {
        var result = await _service.DeleteAsync(id);
        return this.FromResult(result);
    }

    /// <summary>
    /// Deletes multiple users identified by their GUIDs.
    /// </summary>
    /// <param name="ids">A list of user GUIDs to delete.</param>
    /// <returns>An IActionResult indicating the outcome of the operation.</returns>
    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteListAsync(List<Guid> ids)
    {
        var result = await _service.DeleteListAsync(ids);
        return this.FromResult(result);
    }

    /// <summary>
    /// Locks a user account by its unique identifier.
    /// </summary>
    /// <param name="id">The GUID of the user to lock.</param>
    /// <returns>An IActionResult indicating the outcome of the lock operation.</returns>
    [HttpPost("lock/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> LockUserAsync(Guid id)
    {
        var result = await _service.LockUserAsync(id);
        return this.FromResult(result);
    }
}

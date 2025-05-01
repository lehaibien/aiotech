using Application.Users;
using Application.Users.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Application.Shared;
using WebApi.Extensions;

namespace WebApi.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _service;

    public UserController(IUserService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetListAsync([FromQuery] GetListRequest request)
    {
        var result = await _service.GetListAsync(request);
        return this.FromResult(result);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetByIdAsync(Guid id)
    {
        var result = await _service.GetByIdAsync(id);
        return this.FromResult(result);
    }

    [HttpGet("{id:guid}/profile")]
    public async Task<IActionResult> GetUserProfileByIdAsync(Guid id)
    {
        var result = await _service.GetProfileByIdAsync(id);
        return this.FromResult(result);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateAsync([FromForm] UserRequest request)
    {
        var result = await _service.CreateAsync(request);
        return this.FromResult(result);
    }

    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateAsync([FromForm] UserRequest request)
    {
        var result = await _service.UpdateAsync(request);
        return this.FromResult(result);
    }

    [HttpPost("profile")]
    public async Task<IActionResult> ChangeProfileAsync([FromForm] UserProfileRequest request)
    {
        var result = await _service.UpdateProfileAsync(request);
        return this.FromResult(result);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteAsync(Guid id)
    {
        var result = await _service.DeleteAsync(id);
        return this.FromResult(result);
    }

    [HttpDelete]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteListAsync(List<Guid> ids)
    {
        var result = await _service.DeleteListAsync(ids);
        return this.FromResult(result);
    }

    [HttpPost("lock/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> LockUserAsync(Guid id)
    {
        var result = await _service.LockUserAsync(id);
        return this.FromResult(result);
    }
}

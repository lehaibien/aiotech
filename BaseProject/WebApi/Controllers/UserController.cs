using Application.Users;
using Application.Users.Dtos;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Shared;
using WebApi.Model;

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

    [HttpGet("{id:guid}/profile")]
    public async Task<IActionResult> GetUserProfileById(Guid id)
    {
        var response = new ApiResponse();
        var result = await _service.GetProfileById(id);
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
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Create([FromForm] CreateUserRequest request)
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
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Update([FromForm] UpdateUserRequest request)
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

    [HttpPost("profile")]
    public async Task<IActionResult> ChangeProfile([FromForm] UserProfileRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.UpdateProfile(request);
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
    [Authorize(Roles = "Admin")]
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
    [Authorize(Roles = "Admin")]
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

    [HttpPost("lock/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> LockUser(Guid id)
    {
        var response = new ApiResponse();
        var result = await _service.LockUser(id);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        return Ok(response);
    }
}

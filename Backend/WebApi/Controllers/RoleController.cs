using Application.Roles;
using Application.Roles.Dtos;
using Microsoft.AspNetCore.Mvc;
using Shared;
using WebApi.Model;

namespace WebApi.Controllers;

[Route("[controller]")]
[ApiController]
public class RoleController : ControllerBase
{
    private readonly IRoleService _service;

    public RoleController(IRoleService service)
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

        response.Data = result.Value;
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
        response.Data = result.Value;
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateRoleRequest request)
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

    [HttpPut]
    public async Task<IActionResult> Update(UpdateRoleRequest request)
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
        response.Data = result.Value;
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
        response.Data = result.Value;
        return Ok(response);
    }

    [HttpGet("combo-box")]
    public async Task<IActionResult> GetComboBox()
    {
        var response = new ApiResponse();
        var result = await _service.GetComboBox();
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

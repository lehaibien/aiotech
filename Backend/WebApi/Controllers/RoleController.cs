using Application.Roles;
using Application.Roles.Dtos;
using Microsoft.AspNetCore.Mvc;
using Application.Shared;
using WebApi.Extensions;

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

    [HttpPost]
    public async Task<IActionResult> CreateAsync(RoleRequest request)
    {
        var result = await _service.CreateAsync(request);
        return this.FromResult(result);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateAsync(RoleRequest request)
    {
        var result = await _service.UpdateAsync(request);
        return this.FromResult(result);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> DeleteAsync(Guid id)
    {
        var result = await _service.DeleteAsync(id);
        return this.FromResult(result);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteListAsync(List<Guid> ids)
    {
        var result = await _service.DeleteListAsync(ids);
        return this.FromResult(result);
    }

    [HttpGet("combo-box")]
    public async Task<IActionResult> GetComboBoxAsync()
    {
        var result = await _service.GetComboBoxAsync();
        return this.FromResult(result);
    }
}

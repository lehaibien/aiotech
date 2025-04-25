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

    /// <summary>
    /// Initializes a new instance of the <see cref="RoleController"/> class with the specified role service.
    /// </summary>
    public RoleController(IRoleService service)
    {
        _service = service;
    }

    /// <summary>
    /// Retrieves a list of roles based on the specified query parameters.
    /// </summary>
    /// <param name="request">Query parameters for filtering and paging the role list.</param>
    /// <returns>An HTTP response containing the list of roles or an error message.</returns>
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

    /// <summary>
    /// Retrieves a role by its unique identifier.
    /// </summary>
    /// <param name="id">The GUID of the role to retrieve.</param>
    /// <returns>An HTTP response containing the role data if found, or an error message if not.</returns>
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

    /// <summary>
    /// Creates a new role using the provided request data.
    /// </summary>
    /// <param name="request">The details of the role to create.</param>
    /// <returns>An HTTP response containing the created role data or an error message.</returns>
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

    /// <summary>
    /// Updates an existing role with the provided information.
    /// </summary>
    /// <param name="request">The updated role data.</param>
    /// <returns>An HTTP response containing the update result or an error message.</returns>
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

    /// <summary>
    /// Deletes a role by its unique identifier.
    /// </summary>
    /// <param name="id">The unique identifier of the role to delete.</param>
    /// <returns>An HTTP response indicating the result of the deletion operation.</returns>
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

    /// <summary>
    /// Deletes multiple roles identified by their GUIDs.
    /// </summary>
    /// <param name="ids">A list of role GUIDs to delete.</param>
    /// <returns>An HTTP response indicating the result of the deletion operation.</returns>
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

    /// <summary>
    /// Retrieves a list of roles formatted for use in a combo box UI element.
    /// </summary>
    /// <returns>An HTTP response containing the combo box data or an error message.</returns>
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

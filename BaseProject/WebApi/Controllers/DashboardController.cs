using Application.Dashboard;
using Microsoft.AspNetCore.Mvc;
using WebApi.Model;

namespace WebApi.Controllers;

[Route("[controller]")]
[ApiController]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _service;

    public DashboardController(IDashboardService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetDashboardCardAsync()
    {
        var response = new ApiResponse();
        var result = await _service.GetDashboardCardAsync();
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

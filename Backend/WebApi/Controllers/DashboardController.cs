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

    [HttpGet("card")]
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

    [HttpGet("top-product")]
    public async Task<IActionResult> GetDashboardTopProductAsync()
    {
        var response = new ApiResponse();
        var result = await _service.GetDashboardTopProductAsync();
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Data;
        return Ok(response);
    }

    [HttpGet("sale")]
    public async Task<IActionResult> GetDashboardSaleAsync()
    {
        var response = new ApiResponse();
        var result = await _service.GetDashboardSaleAsync();
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Data;
        return Ok(response);
    }

    [HttpGet("stock-alert")]
    public async Task<IActionResult> GetDashboardStockAlertAsync(int stockThreshold = 5)
    {
        var response = new ApiResponse();
        var result = await _service.GetDashboardStockAlertAsync(stockThreshold);
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

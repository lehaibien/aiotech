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

    /// <summary>
    /// Retrieves dashboard card data and returns it in a standardized API response.
    /// </summary>
    /// <returns>An <see cref="IActionResult"/> containing the dashboard card data or an error message if retrieval fails.</returns>
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
        response.Data = result.Value;
        return Ok(response);
    }

    /// <summary>
    /// Retrieves the top product data for the dashboard.
    /// </summary>
    /// <returns>An HTTP response containing the top product information or an error message if retrieval fails.</returns>
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

        response.Data = result.Value;
        return Ok(response);
    }

    /// <summary>
    /// Retrieves sales data for the dashboard.
    /// </summary>
    /// <returns>An HTTP response containing the dashboard sales data or an error message if retrieval fails.</returns>
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

        response.Data = result.Value;
        return Ok(response);
    }

    /// <summary>
    /// Retrieves dashboard stock alert data for products below the specified stock threshold.
    /// </summary>
    /// <param name="stockThreshold">The stock quantity threshold for triggering alerts. Defaults to 5.</param>
    /// <returns>An API response containing stock alert data or an error message if retrieval fails.</returns>
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

        response.Data = result.Value;
        return Ok(response);
    }
}

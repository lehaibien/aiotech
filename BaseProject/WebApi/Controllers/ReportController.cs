using Application.Reports;
using Application.Reports.Dtos;
using Microsoft.AspNetCore.Mvc;
using Shared;
using WebApi.Model;

namespace WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ReportController : ControllerBase
{
    private readonly IReportService _service;

    public ReportController(IReportService service)
    {
        _service = service;
    }

    [HttpGet("sale")]
    public async Task<IActionResult> GetSaleReportAsync([FromQuery] SaleReportRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.GetSaleReportsAsync(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Data;
        return Ok(response);
    }

    [HttpGet("order")]
    public async Task<IActionResult> GetOrderReportAsync([FromQuery] OrderReportRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.GetOrderReportsAsync(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Data;
        return Ok(response);
    }

    [HttpGet("product-rating")]
    public async Task<IActionResult> GetLowRatingProductReportAsync(
        [FromQuery] LowRatingProductReportRequest request
    )
    {
        var response = new ApiResponse();
        var result = await _service.GetLowRatingProductsAsync(request);
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

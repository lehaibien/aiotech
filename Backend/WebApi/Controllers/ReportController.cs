using Application.Reports;
using Application.Reports.Dtos;
using Microsoft.AspNetCore.Mvc;
using WebApi.Model;

namespace WebApi.Controllers;

[Route("[controller]")]
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

        response.Data = result.Value;
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

        response.Data = result.Value;
        return Ok(response);
    }

    [HttpGet("product-rating")]
    public async Task<IActionResult> GetLowRatingProductReportAsync()
    {
        var response = new ApiResponse();
        var result = await _service.GetProductRatingReportAsync();
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Value;
        return Ok(response);
    }

    [HttpGet("out-of-stock")]
    public async Task<IActionResult> GetOutOfStockReportAsync(
        [FromQuery] InventoryStatusReportRequest request
    )
    {
        var response = new ApiResponse();
        var result = await _service.GetInventoryStatusReportAsync(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Value;
        return Ok(response);
    }

    [HttpGet("brand-performance")]
    public async Task<IActionResult> GetBrandPerformanceReportAsync(
        [FromQuery] BrandPerformanceReportRequest request
    )
    {
        var response = new ApiResponse();
        var result = await _service.GetBrandPerformanceReportAsync(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Value;
        return Ok(response);
    }

    [HttpGet("category-performance")]
    public async Task<IActionResult> GetCategoryPerformanceReportAsync(
        [FromQuery] CategoryPerformanceReportRequest request
    )
    {
        var response = new ApiResponse();
        var result = await _service.GetCategoryPerformanceReportAsync(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Value;
        return Ok(response);
    }

    [HttpGet("top-customer")]
    public async Task<IActionResult> GetTopCustomerReportAsync(
        [FromQuery] GetTopCustomerReportRequest request
    )
    {
        var response = new ApiResponse();
        var result = await _service.GetTopCustomerReportAsync(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Value;
        return Ok(response);
    }

    [HttpGet("top-product")]
    public async Task<IActionResult> GetTopProductReportAsync(
        [FromQuery] TopSellingProductRequest request
    )
    {
        var response = new ApiResponse();
        var result = await _service.GetTopSellingProductsAsync(request);
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

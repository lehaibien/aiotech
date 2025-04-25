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

    /// <summary>
    /// Retrieves a sales report based on the specified query parameters.
    /// </summary>
    /// <param name="request">The parameters used to filter and generate the sales report.</param>
    /// <returns>An <see cref="IActionResult"/> containing the sales report data or an error message if the request fails.</returns>
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

    /// <summary>
    /// Retrieves an order report based on the specified query parameters.
    /// </summary>
    /// <param name="request">The parameters used to filter and generate the order report.</param>
    /// <returns>An HTTP response containing the order report data or an error message if the request fails.</returns>
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

    /// <summary>
    /// Retrieves a report of products with low customer ratings.
    /// </summary>
    /// <returns>An HTTP response containing the low rating product report data or an error message if retrieval fails.</returns>
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

    /// <summary>
    /// Retrieves a report of products that are out of stock based on the specified inventory status criteria.
    /// </summary>
    /// <param name="request">The inventory status filter parameters for the report.</param>
    /// <returns>An HTTP response containing the out-of-stock report data or an error message if the request fails.</returns>
    [HttpGet("out-of-stock")]
    public async Task<IActionResult> GetOutOfStockReportAsync(
        [FromQuery] InventoryStatusReportRequest request
    )
    {
        var response = new ApiResponse();
        var result = await _service.GetOutOfStockReportAsync(request);
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
    /// Retrieves the brand performance report based on the specified criteria.
    /// </summary>
    /// <param name="request">The parameters used to filter and generate the brand performance report.</param>
    /// <returns>An HTTP response containing the brand performance report data or an error message if the request fails.</returns>
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

    /// <summary>
    /// Retrieves a category performance report based on the specified request parameters.
    /// </summary>
    /// <param name="request">The parameters used to filter and generate the category performance report.</param>
    /// <returns>An HTTP response containing the report data or an error message if the request fails.</returns>
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

    /// <summary>
    /// Retrieves a report of top customers based on the specified criteria.
    /// </summary>
    /// <param name="request">The parameters used to filter and generate the top customer report.</param>
    /// <returns>An HTTP response containing the top customer report data or an error message if the request fails.</returns>
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

    /// <summary>
    /// Retrieves a report of top-selling products based on the specified criteria.
    /// </summary>
    /// <param name="request">The parameters used to filter and generate the top-selling product report.</param>
    /// <returns>An HTTP response containing the top-selling product report data or an error message if the request fails.</returns>
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

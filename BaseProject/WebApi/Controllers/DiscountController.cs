using Application.Discounts;
using Microsoft.AspNetCore.Mvc;
using Shared;
using WebApi.Model;

namespace WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class DiscountController : ControllerBase
{
    private readonly IDiscountService _service;

    public DiscountController(IDiscountService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> IsValid(string couponCode)
    {
        var response = new ApiResponse();
        var result = await _service.IsDiscountValid(couponCode);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> ApplyCoupon(string couponCode)
    {
        var response = new ApiResponse();
        var result = await _service.ApplyDiscount(couponCode);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        return Ok(response);
    }
}

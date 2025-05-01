using Application.Discounts;
using Microsoft.AspNetCore.Mvc;
using Application.Shared;
using WebApi.Model;

namespace WebApi.Controllers;

[Route("[controller]")]
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
        var result = await _service.IsDiscountValidAsync(couponCode);
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
        var result = await _service.ApplyDiscountAsync(couponCode);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        return Ok(response);
    }
}

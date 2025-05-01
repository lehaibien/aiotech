using Application.Orders;
using Application.Orders.Dtos;
using Microsoft.AspNetCore.Mvc;
using WebApi.Model;

namespace WebApi.Controllers;

[Route("[controller]")]
[ApiController]
public class OrderController : ControllerBase
{
    private readonly IOrderService _service;
    private readonly ILogger<OrderController> _logger;

    public OrderController(IOrderService service, ILogger<OrderController> logger)
    {
        _service = service;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] OrderGetListRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.GetListAsync(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Value;
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var response = new ApiResponse();
        var result = await _service.GetByIdAsync(id);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Value;
        return Ok(response);
    }

    [HttpGet("{username}")]
    public async Task<IActionResult> GetByUsername(string username)
    {
        var response = new ApiResponse();
        var result = await _service.GetByUsernameAsync(username);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Value;
        return Ok(response);
    }

    [HttpGet("recent")]
    public async Task<IActionResult> GetRecentOrders([FromQuery] int count = 10)
    {
        var response = new ApiResponse();
        var result = await _service.GetRecentOrdersAsync(count);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Value;
        return Ok(response);
    }

    [HttpPost("url")]
    public async Task<IActionResult> CreateUrl(OrderCheckoutRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.CreateUrlAsync(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Value;
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Create(OrderRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.CreateAsync(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Value;
        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> Update(OrderRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.UpdateAsync(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Value;
        return Ok(response);
    }

    [HttpPut("status")]
    public async Task<IActionResult> UpdateStatus([FromBody] OrderUpdateStatusRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.ChangeStatusAsync(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var response = new ApiResponse();
        var result = await _service.DeleteAsync(id);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Value;
        return Ok(response);
    }

    [HttpDelete]
    public async Task<IActionResult> DeleteList(List<Guid> ids)
    {
        var response = new ApiResponse();
        var result = await _service.DeleteListAsync(ids);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Value;
        return Ok(response);
    }

    [HttpGet("{id:guid}/print")]
    public async Task<IActionResult> Print(Guid id)
    {
        var response = new ApiResponse();
        var result = await _service.PrintReceiptAsync(id);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Value;
        return Ok(response);
    }

    [HttpGet("callback")]
    public async Task<IActionResult> Callback()
    {
        var response = new ApiResponse();
        var result = await _service.HandleCallbackPaymentAsync(Request.Query);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpPost("confirm/{id:guid}")]
    public async Task<IActionResult> Confirm(Guid id)
    {
        var response = new ApiResponse();
        var result = await _service.ConfirmAsync(id);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        return Ok(response);
    }

    [HttpPut("cancel")]
    public async Task<IActionResult> Cancel([FromBody] OrderCancelRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.CancelAsync(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        return Ok(response);
    }
}

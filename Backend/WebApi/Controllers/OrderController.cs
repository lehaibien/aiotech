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

    /// <summary>
    /// Retrieves a list of orders based on the specified query parameters.
    /// </summary>
    /// <param name="request">The filter and pagination criteria for retrieving orders.</param>
    /// <returns>An HTTP 200 response with the list of orders on success, or HTTP 400 with an error message on failure.</returns>
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

    /// <summary>
    /// Retrieves an order by its unique identifier.
    /// </summary>
    /// <param name="id">The GUID of the order to retrieve.</param>
    /// <returns>An HTTP 200 response with the order data if found; otherwise, HTTP 400 with an error message.</returns>
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
    /// Retrieves all orders associated with the specified username.
    /// </summary>
    /// <param name="username">The username whose orders are to be retrieved.</param>
    /// <returns>An HTTP 200 response with the user's orders on success; HTTP 400 with an error message on failure.</returns>
    [HttpGet("{username}")]
    public async Task<IActionResult> GetByUsername(string username)
    {
        var response = new ApiResponse();
        var result = await _service.GetByUsername(username);
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
    /// Retrieves a specified number of the most recent orders.
    /// </summary>
    /// <param name="count">The number of recent orders to retrieve. Defaults to 10 if not specified.</param>
    /// <returns>An HTTP 200 response with the recent orders on success; HTTP 400 with an error message on failure.</returns>
    [HttpGet("recent")]
    public async Task<IActionResult> GetRecentOrders([FromQuery] int count = 10)
    {
        var response = new ApiResponse();
        var result = await _service.GetRecentOrders(count);
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
    /// Generates a checkout URL for an order based on the provided request data.
    /// </summary>
    /// <param name="request">The order checkout request containing order details.</param>
    /// <returns>An HTTP 200 response with the generated checkout URL on success; HTTP 400 with an error message on failure.</returns>
    [HttpPost("url")]
    public async Task<IActionResult> CreateUrl(OrderCheckoutRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.CreateUrl(request);
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
    /// Creates a new order and returns the created order data.
    /// </summary>
    /// <param name="request">The order details to create.</param>
    /// <returns>An HTTP 200 response with the created order data on success; HTTP 400 with an error message on failure.</returns>
    [HttpPost]
    public async Task<IActionResult> Create(OrderRequest request)
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
    /// Updates an existing order with the provided details.
    /// </summary>
    /// <param name="request">The order information to update.</param>
    /// <returns>An HTTP 200 response with the updated order data on success, or HTTP 400 with an error message on failure.</returns>
    [HttpPut]
    public async Task<IActionResult> Update(OrderRequest request)
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

    [HttpPut("status")]
    public async Task<IActionResult> UpdateStatus([FromBody] OrderUpdateStatusRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.ChangeStatus(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        return Ok(response);
    }

    /// <summary>
    /// Deletes an order by its unique identifier.
    /// </summary>
    /// <param name="id">The GUID of the order to delete.</param>
    /// <returns>HTTP 200 with deletion result on success; HTTP 400 with error message on failure.</returns>
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
    /// Deletes multiple orders identified by their GUIDs.
    /// </summary>
    /// <param name="ids">A list of order GUIDs to delete.</param>
    /// <returns>HTTP 200 with deletion result on success; HTTP 400 with error message on failure.</returns>
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
    /// Generates and returns a printable receipt for the specified order.
    /// </summary>
    /// <param name="id">The unique identifier of the order.</param>
    /// <returns>An HTTP 200 response with the receipt data if successful; otherwise, HTTP 400 with an error message.</returns>
    [HttpGet("{id:guid}/print")]
    public async Task<IActionResult> Print(Guid id)
    {
        var response = new ApiResponse();
        var result = await _service.PrintReceipt(id);
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
        var result = await _service.HandleCallbackPayment(Request.Query);
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
        var result = await _service.Confirm(id);
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
        var result = await _service.Cancel(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        return Ok(response);
    }
}

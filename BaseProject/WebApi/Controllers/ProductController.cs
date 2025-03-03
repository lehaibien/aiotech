using Application.Products;
using Application.Products.Dtos;
using Microsoft.AspNetCore.Mvc;
using WebApi.Model;

namespace WebApi.Controllers;

[Route("api/[controller]")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly IProductService _service;

    public ProductController(IProductService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetList([FromQuery] GetListProductRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.GetList(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Data;
        return Ok(response);
    }

    [HttpGet("search")]
    public async Task<IActionResult> Search([FromQuery] SearchProductRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.Search(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Data;
        return Ok(response);
    }

    [HttpGet("top/{top:int}")]
    public async Task<IActionResult> GetTopProducts(int top)
    {
        var response = new ApiResponse();
        var result = await _service.GetTopProducts(top);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Data;
        return Ok(response);
    }

    [HttpGet("featured/{top:int}")]
    public async Task<IActionResult> GetFeaturedProducts(int top) {
        var response = new ApiResponse();
        var result = await _service.GetFeaturedProducts(top);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Data;
        return Ok(response);
    }

    [HttpGet("related")]
    public async Task<IActionResult> GetRelatedProducts(
        [FromQuery] GetRelatedProductsRequest request
    )
    {
        var response = new ApiResponse();
        var result = await _service.GetRelatedProducts(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Data;
        return Ok(response);
    }

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
        response.Data = result.Data;
        return Ok(response);
    }

    [HttpGet("request/{id:guid}")]
    public async Task<IActionResult> GetRequestById(Guid id)
    {
        var response = new ApiResponse();
        var result = await _service.GetRequestById(id);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Data;
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateProductRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.Create(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Data;
        return Ok(response);
    }

    [HttpPut]
    public async Task<IActionResult> Update([FromForm] UpdateProductRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.Update(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Data;
        return Ok(response);
    }

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
        response.Data = result.Data;
        return Ok(response);
    }

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
        response.Data = result.Data;
        return Ok(response);
    }
}

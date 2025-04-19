using Application.Products;
using Application.Products.Dtos;
using Microsoft.AspNetCore.Mvc;
using Shared;
using WebApi.Model;

namespace WebApi.Controllers;

[Route("[controller]")]
[ApiController]
public class ProductController : ControllerBase
{
    private readonly IProductService _service;

    public ProductController(IProductService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetListAsync([FromQuery] GetListRequest request)
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

    [HttpGet("filtered")]
    public async Task<IActionResult> GetListFilteredAsync(
        [FromQuery] GetListFilteredProductRequest request
    )
    {
        var response = new ApiResponse();
        var result = await _service.GetListFilteredAsync(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Value;
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
        response.Data = result.Value;
        return Ok(response);
    }

    [HttpGet("top")]
    public async Task<IActionResult> GetTopProducts([FromQuery] int count = 8)
    {
        var response = new ApiResponse();
        var result = await _service.GetTopProducts(count);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Value;
        return Ok(response);
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeaturedProducts([FromQuery] int count = 8)
    {
        var response = new ApiResponse();
        var result = await _service.GetFeaturedProducts(count);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Value;
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
        response.Data = result.Value;
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
        response.Data = result.Value;
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
        response.Data = result.Value;
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
        response.Data = result.Value;
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
        response.Data = result.Value;
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
        response.Data = result.Value;
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
        response.Data = result.Value;
        return Ok(response);
    }
}

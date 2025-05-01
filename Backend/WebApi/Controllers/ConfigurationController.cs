using Application.Configurations;
using Application.Configurations.Dtos;
using Microsoft.AspNetCore.Mvc;
using WebApi.Model;

namespace WebApi.Controllers;

[Route("[controller]")]
[ApiController]
public class ConfigurationController : ControllerBase
{
    private readonly IConfigurationService _service;

    public ConfigurationController(IConfigurationService service)
    {
        _service = service;
    }

    [HttpGet("banner")]
    public async Task<IActionResult> GetBannerConfiguration()
    {
        var response = new ApiResponse();
        var result = await _service.GetBannerConfigurationAsync();
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Value;
        return Ok(response);
    }

    [HttpPost("banner")]
    public async Task<IActionResult> SetBannerConfiguration([FromBody] BannerConfiguration request)
    {
        var response = new ApiResponse();
        var result = await _service.SetBannerConfiguration(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Value;
        return Ok(response);
    }

    [HttpGet("email")]
    public async Task<IActionResult> GetEmailConfiguration()
    {
        var response = new ApiResponse();
        var result = await _service.GetEmailConfiguration();
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Value;
        return Ok(response);
    }

    [HttpPost("email")]
    public async Task<IActionResult> SetEmailConfiguration([FromBody] EmailConfiguration request)
    {
        var response = new ApiResponse();
        var result = await _service.SetEmailConfiguration(request);
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

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

    /// <summary>
    /// Retrieves the current banner configuration settings.
    /// </summary>
    /// <returns>An HTTP 200 response with the banner configuration data if successful; otherwise, an HTTP 400 response with an error message.</returns>
    [HttpGet("banner")]
    public async Task<IActionResult> GetBannerConfiguration()
    {
        var response = new ApiResponse();
        var result = await _service.GetBannerConfiguration();
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
    /// Updates the banner configuration with the provided settings.
    /// </summary>
    /// <param name="request">The new banner configuration to apply.</param>
    /// <returns>An HTTP 200 response with the updated configuration on success, or HTTP 400 with an error message on failure.</returns>
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

    /// <summary>
    /// Retrieves the current email configuration settings.
    /// </summary>
    /// <returns>An HTTP response containing the email configuration data if successful; otherwise, a bad request with an error message.</returns>
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

    /// <summary>
    /// Updates the email configuration settings.
    /// </summary>
    /// <param name="request">The new email configuration to apply.</param>
    /// <returns>An HTTP response containing the updated configuration if successful, or an error message if the update fails.</returns>
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

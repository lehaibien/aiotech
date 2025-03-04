using Application.Authentication.Dtos;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using WebApi.Model;
using IAuthenticationService = Application.Authentication.IAuthenticationService;

namespace WebApi.Controllers;

[Route("[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthenticationService _service;
    private readonly CookieOptions _cookieOptions = new()
    {
        HttpOnly = true,
        SameSite = SameSiteMode.Strict,
        Secure = true,
        Expires = DateTime.Now.AddDays(1),
    };

    public AuthController(IAuthenticationService service)
    {
        _service = service;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(AuthLoginRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.Login(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        // HttpContext.Response.Cookies.Append("token", result.Data.AccessToken, _cookieOptions);
        response.Data = result.Data;
        return Ok(response);
    }

    [HttpPost("social-login")]
    public async Task<IActionResult> SocialLogin(OAuthLoginRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.SocialLogin(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        // HttpContext.Response.Cookies.Append("token", result.Data.AccessToken ?? "", _cookieOptions);
        response.Data = result.Data;
        return Ok(response);
    }

    // [HttpGet("login-google")]
    // public IActionResult LoginWithGoogle()
    // {
    //     var properties = new AuthenticationProperties
    //     {
    //         RedirectUri = "/api/user/login-google-callback"
    //     };
    //     return Challenge(properties, "Google");
    // }
    //
    // [HttpGet("login-google-callback")]
    // public async Task<IActionResult> LoginWithGoogleCallback()
    // {
    //     var response = new ApiResponse();
    //     var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    //     var result = await _service.LoginByGoogle(authenticateResult);
    //     if (result.IsFailure)
    //     {
    //         response.Success = false;
    //         response.Message = result.Message;
    //         return BadRequest(response);
    //     }
    //
    //     HttpContext.Response.Cookies.Append("token", result.Data.AccessToken ?? "", _cookieOptions);
    //     response.Data = result.Data;
    //     return Ok(response);
    // }
    //
    // [HttpGet("login-facebook")]
    // public IActionResult LoginWithFacebook()
    // {
    //     var properties = new AuthenticationProperties
    //     {
    //         RedirectUri = "/api/user/login-facebook-callback"
    //     };
    //     return Challenge(properties, "Facebook");
    // }
    //
    // [HttpGet("login-facebook-callback")]
    // public async Task<IActionResult> LoginWithFacebookCallback()
    // {
    //     var response = new ApiResponse();
    //     var authenticateResult = await HttpContext.AuthenticateAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    //     var result = await _service.LoginByFacebook(authenticateResult);
    //     if (result.IsFailure)
    //     {
    //         response.Success = false;
    //         response.Message = result.Message;
    //         return BadRequest(response);
    //     }
    //
    //     HttpContext.Response.Cookies.Append("token", result.Data.AccessToken ?? "", _cookieOptions);
    //     response.Data = result.Data;
    //     return Ok(response);
    // }

    // [HttpPost("verify-google")]
    //     public async Task<IActionResult> VerifyGoogle(UserGoogleLoginRequest request)
    //     {
    //         var response = new ApiResponse();
    //         var result = await _service.VerifyGoogle(request);
    //         if (result.IsFailure)
    //         {
    //             response.Success = false;
    //             response.Message = result.Message;
    //             return BadRequest(response);
    //         }
    //         response.Data = result.Data;
    //         return Ok(response);
    //     }

    [HttpPost("register")]
    public async Task<IActionResult> Register(AuthRegisterRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.Register(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }

        response.Data = result.Data;
        return Ok(response);
    }

    [HttpPost("confirm-email")]
    public async Task<IActionResult> ConfirmEmail(ConfirmEmailRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.ConfirmEmail(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        return Ok(response);
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.RefreshToken(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        response.Data = result.Data;
        return Ok(response);
    }

    [HttpPost("change-password")]
    public async Task<IActionResult> ChangePassword(ChangePasswordRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.ChangePassword(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        return Ok(response);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ForgotPassword(ResetPasswordRequest request)
    {
        var response = new ApiResponse();
        var result = await _service.ResetPassword(request);
        if (result.IsFailure)
        {
            response.Success = false;
            response.Message = result.Message;
            return BadRequest(response);
        }
        return Ok(response);
    }
}

using Microsoft.AspNetCore.Mvc;
using Application.Shared;
using WebApi.Model;

namespace WebApi.Extensions;

public static class ControllerExtension
{
    public static IActionResult FromResult(this ControllerBase controller, Result result)
    {
        var response = new ApiResponse();
        if (result.IsSuccess)
        {
            return controller.Ok(response);
        }

        response.Success = false;
        response.Message = result.Message;
        return controller.BadRequest(response);
    }

    public static IActionResult FromResult<T>(this ControllerBase controller, Result<T> result)
        where T : class
    {
        var response = new ApiResponse();
        if (result.IsSuccess)
        {
            response.Data = result.Value;
            return controller.Ok(response);
        }

        response.Success = false;
        response.Message = result.Message;
        return controller.BadRequest(response);
    }
}

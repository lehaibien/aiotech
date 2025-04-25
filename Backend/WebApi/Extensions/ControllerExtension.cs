using Microsoft.AspNetCore.Mvc;
using Shared;
using WebApi.Model;

namespace WebApi.Extensions;

public static class ControllerExtension
{
    /// <summary>
    /// Converts a <see cref="Result"/> into an <see cref="IActionResult"/> with a standardized API response.
    /// </summary>
    /// <param name="result">The operation result to convert.</param>
    /// <returns>
    /// An HTTP 200 OK response with a default <see cref="ApiResponse"/> if successful,
    /// or an HTTP 400 Bad Request with an error message if not.
    /// </returns>
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

    /// <summary>
    /// Converts a <see cref="Result{T}"/> to an <see cref="IActionResult"/>, returning a standardized API response with data on success or an error message on failure.
    /// </summary>
    /// <typeparam name="T">The type of the data contained in the result.</typeparam>
    /// <param name="result">The operation result to convert.</param>
    /// <returns>
    /// An HTTP 200 OK response with the result data if successful, or an HTTP 400 Bad Request with an error message if not.
    /// </returns>
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

using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Application.Helpers;

public static class Utilities
{
    public static string GetBaseUri(HttpRequest request)
    {
        var baseUri = $"{request.Scheme}://{request.Host}";
        return baseUri;
    }

    public static string ConvertImageUrlToBase64(string imageUrl)
    {
        try
        {
            var image = System.IO.File.OpenRead(imageUrl);
            var bytes = new byte[image.Length];
            var _ = image.Read(bytes, 0, (int)image.Length);
            var base64 = "data:image/png;base64," + Convert.ToBase64String(bytes);
            image.Close();
            return base64;
        }
        catch (Exception)
        {
            return string.Empty;
        }
    }

    public static string GetContentType(string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();

        return extension switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            ".bmp" => "image/bmp",
            ".webp" => "image/webp",
            _ => "application/octet-stream", // Default content type for unknown types
        };
    }

    public static string GetOrderStatusText(OrderStatus status)
    {
        return status switch
        {
            OrderStatus.Pending => "Chờ xử lý",
            OrderStatus.Paid => "Đã thanh toán",
            OrderStatus.Processing => "Đang xử lý",
            OrderStatus.Delivering => "Đang giao",
            OrderStatus.Delivered => "Đã giao",
            OrderStatus.Completed => "Đã hoàn thành",
            OrderStatus.Cancelled => "Đã hủy",
            _ => "",
        };
    }

    /// <summary>
    /// Determines whether the specified file extension is included in the list of allowed extensions.
    /// </summary>
    /// <param name="extension">The file extension to check, with or without a leading dot.</param>
    /// <param name="allowedExtensions">An array of allowed file extensions.</param>
    /// <returns>True if the extension is allowed; otherwise, false.</returns>
    public static bool IsAllowedExtension(string extension, string[] allowedExtensions)
    {
        extension = extension.ToLowerInvariant();
        return Array.Exists(
            allowedExtensions,
            ext => ext.Equals(extension, StringComparison.InvariantCultureIgnoreCase)
        );
    }

    /// <summary>
    /// Retrieves the username from the JWT claims in the provided HTTP context.
    /// </summary>
    /// <param name="context">The HTTP context containing the user principal.</param>
    /// <returns>The username from the JWT "name" claim, or an empty string if not found.</returns>
    public static string GetUsernameFromContext(HttpContext context)
    {
        var username = context
            .User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Name)
            ?.Value;
        return username ?? string.Empty;
    }

    /// <summary>
    /// Returns the path segments of a URL, excluding the scheme and host.
    /// </summary>
    /// <param name="url">The full URL string to extract path segments from.</param>
    /// <returns>An enumerable sequence of path segments as strings.</returns>
    public static IEnumerable<string> ExtractUrlPath(string url)
    {
        var path = url.Split("/").AsEnumerable();
        path = path.Skip(3); // skip scheme and host
        for (int i = 0; i < path.Count(); i++)
        {
            yield return path.ElementAt(i);
        }
    }
}

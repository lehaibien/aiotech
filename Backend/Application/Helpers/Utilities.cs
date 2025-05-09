using System.Security.Cryptography;
using System.Text;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.IdentityModel.JsonWebTokens;

namespace Application.Helpers;

public static class Utilities
{
    public static string GetBaseUri(HttpRequest request)
    {
        return $"{request.Scheme}://{request.Host}";
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

    public static bool IsAllowedExtension(string extension, string[] allowedExtensions)
    {
        extension = extension.ToLowerInvariant();
        return Array.Exists(
            allowedExtensions,
            ext => ext.Equals(extension, StringComparison.InvariantCultureIgnoreCase)
        );
    }

    public static string GetUsernameFromContext(HttpContext context)
    {
        var username = context
            .User.Claims.FirstOrDefault(x => x.Type == JwtRegisteredClaimNames.Name)
            ?.Value;
        return username ?? string.Empty;
    }

    public static IEnumerable<string> ExtractUrlPath(string url)
    {
        var path = url.Split("/").AsEnumerable();
        path = path.Skip(3); // skip scheme and host
        for (int i = 0; i < path.Count(); i++)
        {
            yield return path.ElementAt(i);
        }
    }

    public static string GetRandomAlphanumeric(int length)
    {
        const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        var result = new StringBuilder();
        using (var rng = RandomNumberGenerator.Create())
        {
            byte[] uintBuffer = new byte[sizeof(uint)];

            while (result.Length < length)
            {
                rng.GetBytes(uintBuffer);
                uint num = BitConverter.ToUInt32(uintBuffer, 0);
                result.Append(chars[(int)(num % (uint)chars.Length)]);
            }
        }
        return result.ToString();
    }

    public static string GenerateOrderInfo(string trackingNumber, string name, decimal totalPrice)
    {
        return $"Đơn hàng #{trackingNumber} - {name}: {totalPrice}";
    }
}

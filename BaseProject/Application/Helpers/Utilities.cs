using Microsoft.AspNetCore.Http;

namespace Application.Helpers;

public class Utilities
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
        return string.Empty;
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
            _ => "application/octet-stream" // Default content type for unknown types
        };
    }
}
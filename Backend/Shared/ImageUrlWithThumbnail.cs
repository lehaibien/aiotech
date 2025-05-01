namespace Application.Shared;

public class ImageUrlWithThumbnail
{
    public string Url { get; set; } = string.Empty;
    public string ThumbnailUrl { get; set; } = string.Empty;
}

public class ImageUrlsWithThumbnail
{
    public List<string> Urls { get; set; } = [];
    public string ThumbnailUrl { get; set; } = string.Empty; // Assuming the thumbnail is a single image, not a collection of images like in the u
}

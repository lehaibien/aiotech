namespace Shared;

/// <summary>
/// Defines the different types of images used in the application and their dimensions/processing rules
/// </summary>
public enum ImageType
{
    ProductThumbnail, // 300x300 cropped
    ProductDetail, // 800x800 max dimensions, preserving aspect ratio
    Banner, // 1200x400 cropped
    Branding, // 600x400 cropped
    BlogThumbnail, // 600x400 max
    Blog, // 1200x800 cropped
    Avatar, // 100x100 cropped
    Logo, // No resize, just optimize
}

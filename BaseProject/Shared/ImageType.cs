namespace Shared;

/// <summary>
/// Defines the different types of images used in the application and their dimensions/processing rules
/// </summary>
public enum ImageType
{
    /// <summary>
    /// Product thumbnail image cropped to 300x300 pixels
    /// </summary>
    ProductThumbnail, // 300x300 cropped

    /// <summary>
    /// Product detail image with maximum dimensions of 800x800 pixels, preserving aspect ratio
    /// </summary>
    ProductDetail, // 800x800 max dimensions, preserving aspect ratio

    /// <summary>
    /// Banner image cropped to 1600x400 pixels
    /// </summary>
    Banner, // 1600x400 cropped

    /// <summary>
    /// Mobile banner image cropped to 800x400 pixels
    /// </summary>
    BannerMobile, // 800x400 cropped

    /// <summary>
    /// Category image cropped to 600x400 pixels
    /// </summary>
    Category, // 600x400 cropped

    /// <summary>
    /// Category header image cropped to 1200x300 pixels
    /// </summary>
    CategoryHeader, // 1200x300 cropped

    /// <summary>
    /// Featured blog image cropped to 1200x630 pixels
    /// </summary>
    BlogFeatured, // 1200x630 cropped

    /// <summary>
    /// Blog content image with width of 800 pixels and automatic height
    /// </summary>
    BlogContent, // 800px wide, auto height

    /// <summary>
    /// Logo image that is only optimized without resizing
    /// </summary>
    Logo, // No resize, just optimize
}

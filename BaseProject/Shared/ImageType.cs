namespace Shared;

public enum ImageType
{
    ProductThumbnail, // 300x300 cropped
    ProductDetail, // 800x800 max dimensions, preserving aspect ratio
    Banner, // 1600x400 cropped
    BannerMobile, // 800x400 cropped
    Category, // 600x400 cropped
    CategoryHeader, // 1200x300 cropped
    BlogFeatured, // 1200x630 cropped
    BlogContent, // 800px wide, auto height
    Logo, // No resize, just optimize
}

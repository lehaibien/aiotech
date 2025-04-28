using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Shared;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace Application.Images;

public class ImageService : IImageService
{
    private const string ImageFolder = "images";
    private const string BucketName = "aiotech";
    private readonly string[] AllowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
    private readonly string[] AllowedMimeTypes =
    [
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
    ];
    private readonly ILogger<ImageService> _logger;

    public ImageService(ILogger<ImageService> logger)
    {
        _logger = logger;
    }

    public async Task<Result<IFormFile>> OptimizeAsync(
        IFormFile file,
        ImageType imageType,
        string? prefix = null,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            var (image, _, _) = await LoadAndValidateImageAsync(file, cancellationToken);
            var optimizedImage = ProcessImage(image, imageType);
            var fileName = string.IsNullOrWhiteSpace(prefix)
                ? GenerateUniqueFileName(file.FileName)
                : $"{prefix}_{GenerateUniqueFileName(file.FileName)}";
            var fileUpload = await SaveImageAsFormFile(optimizedImage, fileName, cancellationToken);
            return Result<IFormFile>.Success(fileUpload);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Image optimization failed: {Message}", ex.Message);
            return Result<IFormFile>.Failure(ex.Message);
        }
    }

    public async Task<Result<IEnumerable<IFormFile>>> OptimizeBulkAsync(
        IEnumerable<IFormFile> files,
        ImageType imageType,
        string? prefix = null,
        CancellationToken cancellationToken = default
    )
    {
        var optimizedFiles = new List<IFormFile>();

        foreach (var file in files)
        {
            try
            {
                var (image, _, _) = await LoadAndValidateImageAsync(file, cancellationToken);
                var optimizedImage = ProcessImage(image, imageType);
                var fileName = string.IsNullOrWhiteSpace(prefix)
                    ? GenerateUniqueFileName(file.FileName)
                    : $"{prefix}_{GenerateUniqueFileName(file.FileName)}";
                var fileUpload = await SaveImageAsFormFile(
                    optimizedImage,
                    fileName,
                    cancellationToken
                );
                optimizedFiles.Add(fileUpload);
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(
                    "Bulk image optimization skipped file: {FileName} - {Message}",
                    file.FileName,
                    ex.Message
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(
                    ex,
                    "Bulk image optimization failed for file: {FileName}",
                    file.FileName
                );
                throw;
            }
        }
        if (optimizedFiles.Count == 0)
        {
            return Result<IEnumerable<IFormFile>>.Failure("No valid images optimized.");
        }

        return Result<IEnumerable<IFormFile>>.Success(optimizedFiles);
    }

    private bool IsValidImageExtension(string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        return AllowedImageExtensions.Contains(extension);
    }

    private bool IsValidMimeType(string contentType)
    {
        return AllowedMimeTypes.Contains(contentType.ToLowerInvariant());
    }

    private async Task<(Image image, int width, int height)> LoadAndValidateImageAsync(
        IFormFile file,
        CancellationToken cancellationToken
    )
    {
        if (!IsValidImageExtension(file.FileName))
        {
            throw new ArgumentException(
                "Invalid image extension. Supported formats: .jpg, .jpeg, .png, .webp, .gif"
            );
        }

        if (!IsValidMimeType(file.ContentType))
        {
            throw new ArgumentException(
                "Invalid image MIME type. Supported types: image/jpeg, image/png, image/webp, image/gif"
            );
        }

        var image = await Image.LoadAsync(file.OpenReadStream(), cancellationToken);
        return (image, image.Width, image.Height);
    }

    private static string GenerateUniqueFileName(string originalFileName)
    {
        var extension = Path.GetExtension(originalFileName);
        return $"{Path.GetFileNameWithoutExtension(originalFileName)}_{Guid.NewGuid()}{extension}";
    }

    private static async Task<IFormFile> SaveImageAsFormFile(
        Image image,
        string fileName,
        CancellationToken cancellationToken = default
    )
    {
        var stream = new MemoryStream();
        await image.SaveAsWebpAsync(stream, new WebpEncoder { Quality = 80 }, cancellationToken);
        stream.Position = 0;
        return new FormFile(stream, 0, stream.Length, "image", fileName);
    }

    private static Image ProcessImage(Image image, ImageType imageType)
    {
        var resizeOption = GetResizeOption(imageType);
        if (resizeOption is not null)
        {
            image.Mutate(x => x.Resize(resizeOption));
        }
        return image;
    }

    public static ResizeOptions? GetResizeOption(ImageType imageType)
    {
        return imageType switch
        {
            ImageType.ProductThumbnail => new ResizeOptions
            {
                Size = new Size(300, 300),
                Mode = ResizeMode.Max,
            },
            ImageType.ProductDetail => new ResizeOptions
            {
                Size = new Size(800, 800),
                Mode = ResizeMode.Max,
            },
            ImageType.Banner => new ResizeOptions
            {
                Size = new Size(1200, 400),
                Mode = ResizeMode.Max,
            },
            ImageType.Branding => new ResizeOptions
            {
                Size = new Size(600, 400),
                Mode = ResizeMode.Max,
            },
            ImageType.BlogThumbnail => new ResizeOptions
            {
                Size = new Size(600, 400),
                Mode = ResizeMode.Max,
            },
            ImageType.Blog => new ResizeOptions
            {
                Size = new Size(1200, 630),
                Mode = ResizeMode.Max,
            },
            ImageType.Avatar => new ResizeOptions
            {
                Size = new Size(100, 100),
                Mode = ResizeMode.Crop,
            },
            ImageType.Logo => null,
            _ => null,
        };
    }
}

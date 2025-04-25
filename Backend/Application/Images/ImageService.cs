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

    /// <summary>
    /// Initializes a new instance of the <see cref="ImageService"/> class with the specified logger.
    /// </summary>
    public ImageService(ILogger<ImageService> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Optimizes a single image file by validating, resizing according to the specified image type, converting to WebP format, and generating a unique filename.
    /// </summary>
    /// <param name="file">The image file to optimize.</param>
    /// <param name="imageType">The type of image, determining resizing parameters.</param>
    /// <param name="prefix">An optional prefix to prepend to the generated filename.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>A result containing the optimized image as an <see cref="IFormFile"/> on success, or an error message on failure.</returns>
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

    /// <summary>
    /// Optimizes and resizes multiple image files according to the specified image type, returning successfully processed images as WebP format.
    /// </summary>
    /// <param name="files">The collection of image files to optimize.</param>
    /// <param name="imageType">The target image type determining resize parameters.</param>
    /// <param name="prefix">An optional prefix to prepend to each generated file name.</param>
    /// <param name="cancellationToken">Token to observe for cancellation requests.</param>
    /// <returns>A result containing the collection of optimized image files, or a failure result if none were valid.</returns>
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

    /// <summary>
    /// Determines whether the file has an allowed image extension.
    /// </summary>
    /// <param name="fileName">The name of the file to check.</param>
    /// <returns>True if the file extension is allowed; otherwise, false.</returns>
    private bool IsValidImageExtension(string fileName)
    {
        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        return AllowedImageExtensions.Contains(extension);
    }

    /// <summary>
    /// Determines whether the specified MIME type is allowed for image processing.
    /// </summary>
    /// <param name="contentType">The MIME type to validate.</param>
    /// <returns>True if the MIME type is allowed; otherwise, false.</returns>
    private bool IsValidMimeType(string contentType)
    {
        return AllowedMimeTypes.Contains(contentType.ToLowerInvariant());
    }

    /// <summary>
    /// Asynchronously loads an image from the provided file after validating its extension and MIME type.
    /// </summary>
    /// <param name="file">The uploaded image file to validate and load.</param>
    /// <param name="cancellationToken">Token to observe while waiting for the task to complete.</param>
    /// <returns>A tuple containing the loaded <see cref="Image"/>, its width, and height.</returns>
    /// <exception cref="ArgumentException">
    /// Thrown if the file's extension or MIME type is not supported.
    /// </exception>
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

    /// <summary>
    /// Generates a unique file name by appending a GUID to the original file name while preserving its extension.
    /// </summary>
    /// <param name="originalFileName">The original file name including extension.</param>
    /// <returns>A new file name with a GUID appended before the extension.</returns>
    private static string GenerateUniqueFileName(string originalFileName)
    {
        var extension = Path.GetExtension(originalFileName);
        return $"{Path.GetFileNameWithoutExtension(originalFileName)}_{Guid.NewGuid()}{extension}";
    }

    /// <summary>
    /// Saves the provided image as a WebP file with quality 80 and returns it as an <see cref="IFormFile"/>.
    /// </summary>
    /// <param name="image">The image to be saved.</param>
    /// <param name="fileName">The name to assign to the resulting file.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>An <see cref="IFormFile"/> containing the image in WebP format.</returns>
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

    /// <summary>
    /// Resizes the given image according to the specified <see cref="ImageType"/>, if resizing options are defined.
    /// </summary>
    /// <param name="image">The image to process.</param>
    /// <param name="imageType">The type of image, determining resize behavior.</param>
    /// <returns>The processed image, resized if applicable.</returns>
    private static Image ProcessImage(Image image, ImageType imageType)
    {
        var resizeOption = GetResizeOption(imageType);
        if (resizeOption is not null)
        {
            image.Mutate(x => x.Resize(resizeOption));
        }
        return image;
    }

    /// <summary>
    /// Returns predefined resize options for the specified image type, or null if no resizing is required.
    /// </summary>
    /// <param name="imageType">The category of image to determine resizing parameters for.</param>
    /// <returns>A <see cref="ResizeOptions"/> object with target size and mode, or null if resizing is not applicable.</returns>
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
                Size = new Size(450, 300),
                Mode = ResizeMode.Max,
            },
            ImageType.Blog => new ResizeOptions
            {
                Size = new Size(1200, 630),
                Mode = ResizeMode.Max,
            },
            ImageType.Logo => null,
            _ => null,
        };
    }
}

using Application.Files;
using Application.Helpers;
using Application.Images;
using AutoDependencyRegistration.Attributes;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Shared;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats;
using SixLabors.ImageSharp.Formats.Jpeg;
using SixLabors.ImageSharp.Formats.Png;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.PixelFormats;
using SixLabors.ImageSharp.Processing;

namespace Infrastructure.Files;

[RegisterClassAsSingleton]
public class ImageService : IImageService
{
    private const string ImageFolder = "images";
    private readonly string[] AllowedImageExtensions = { ".jpg", ".jpeg", ".png", ".webp", ".gif" };
    private readonly IWebHostEnvironment _webHostEnvironment;
    private readonly IFileService _fileService;

    public ImageService(IFileService fileService, IWebHostEnvironment webHostEnvironment)
    {
        _fileService = fileService;
        _webHostEnvironment = webHostEnvironment;
    }

    public Result<string> GetImageUrl(string fileName, string folderName)
    {
        var urlResult = _fileService.GetFileUrl(fileName, Path.Combine(ImageFolder, folderName));
        if (urlResult.IsFailure)
        {
            return Result<string>.Failure(urlResult.Message);
        }
        return Result<string>.Success(urlResult.Data);
    }

    public Result<List<string>> GetImageUrls(List<string> fileNames, string folderName)
    {
        var urlResult = _fileService.GetFileUrls(fileNames, Path.Combine(ImageFolder, folderName));
        if (urlResult.IsFailure)
        {
            return Result<List<string>>.Failure(urlResult.Message);
        }
        return Result<List<string>>.Success(urlResult.Data);
    }

    public Result<string> GetFileBase64(string fileName, string folderName)
    {
        var result = _fileService.GetFileBase64(fileName, Path.Combine(ImageFolder, folderName));
        if (result.IsFailure)
        {
            return Result<string>.Failure(result.Message);
        }
        return Result<string>.Success(result.Data);
    }

    public async Task<Result<string>> UploadAsync(
        IFormFile file,
        ImageType imageType,
        string folderName,
        CancellationToken cancellationToken = default
    )
    {
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();
        if (!Utilities.IsAllowedExtension(extension, AllowedImageExtensions))
        {
            return Result<string>.Failure(
                "Invalid image format. Supported formats: .jpg, .jpeg, .png, .webp, .gif"
            );
        }

        var baseFolder = Path.Combine(ImageFolder, folderName);

        // Generate a unique base filename
        var baseFileName =
            $"{DateTime.Now:yyyyMMddHHmmss}_{Guid.NewGuid().ToString().Substring(0, 8)}";

        try
        {
            // Step 1: Upload original file
            var originalResult = await _fileService.UploadAsync(
                file,
                baseFolder,
                $"{baseFileName}_original"
            );

            if (!originalResult.IsSuccess)
            {
                return Result<string>.Failure(originalResult.Message);
            }

            var originalFileResult = originalResult.Data;

            // Step 2: Create optimized version
            string optimizedExtension = ShouldPreservePngTransparency(file, extension)
                ? ".png"
                : ".webp";
            var optimizedImage = await ProcessImageAsync(originalFileResult.FilePath, imageType);

            // Create optimized filename
            var optimizedFileName = $"{baseFileName}_optimized{optimizedExtension}";
            var optimizedFolderPath = Path.Combine(_webHostEnvironment.WebRootPath, baseFolder);
            var optimizedFilePath = Path.Combine(optimizedFolderPath, optimizedFileName);

            // Save optimized image
            _fileService.EnsureDirectoryExists(optimizedFolderPath);
            await SaveOptimizedImageAsync(optimizedImage, optimizedFilePath, optimizedExtension);

            // Return URL to the optimized image
            var baseUrl = originalFileResult.FileUrl.Substring(
                0,
                originalFileResult.FileUrl.LastIndexOf('/') + 1
            );

            return Result<string>.Success(Path.Combine(baseUrl, optimizedFileName));
        }
        catch (Exception ex)
        {
            return Result<string>.Failure($"Image processing failed: {ex.Message}");
        }
    }

    public async Task<Result<List<string>>> UploadBulkAsync(
        List<IFormFile> files,
        ImageType imageType,
        string folderName,
        CancellationToken cancellationToken = default
    )
    {
        var results = new List<string>();
        foreach (var file in files)
        {
            var result = await UploadAsync(file, imageType, folderName, cancellationToken);
            if (result.IsSuccess)
            {
                results.Add(result.Data);
            }
            else
            {
                return Result<List<string>>.Failure(result.Message);
            }
        }
        return Result<List<string>>.Success(results);
    }

    public Result Delete(string fileName, string folderName)
    {
        var result = _fileService.Delete(fileName, Path.Combine(ImageFolder, folderName));
        if (result.IsFailure)
        {
            return Result.Failure(result.Message);
        }
        return Result.Success();
    }

    public Result DeleteBulk(List<string> filePaths, string folderName)
    {
        var result = _fileService.DeleteBulk(filePaths, Path.Combine(ImageFolder, folderName));
        if (result.IsFailure)
        {
            return Result.Failure(result.Message);
        }
        return Result.Success();
    }

    public Result DeleteByUrl(string url)
    {
        var result = _fileService.DeleteByUrl(url);
        if (result.IsFailure)
        {
            return Result.Failure(result.Message);
        }
        return Result.Success();
    }

    public Result DeleteBulkByUrl(List<string> urls)
    {
        var result = _fileService.DeleteBulkByUrl(urls);
        if (result.IsFailure)
        {
            return Result.Failure(result.Message);
        }
        return Result.Success();
    }

    private async Task<Image> ProcessImageAsync(string sourceFilePath, ImageType imageType)
    {
        var image = await Image.LoadAsync(sourceFilePath);

        switch (imageType)
        {
            case ImageType.ProductThumbnail:
                image.Mutate(x =>
                    x.Resize(
                        new ResizeOptions { Size = new Size(300, 300), Mode = ResizeMode.Crop }
                    )
                );
                break;

            case ImageType.ProductDetail:
                image.Mutate(x =>
                    x.Resize(new ResizeOptions { Size = new Size(800, 800), Mode = ResizeMode.Max })
                );
                break;

            case ImageType.Banner:
                image.Mutate(x =>
                    x.Resize(
                        new ResizeOptions { Size = new Size(1600, 400), Mode = ResizeMode.Crop }
                    )
                );
                break;

            case ImageType.BannerMobile:
                image.Mutate(x =>
                    x.Resize(
                        new ResizeOptions { Size = new Size(800, 400), Mode = ResizeMode.Crop }
                    )
                );
                break;

            case ImageType.Category:
                image.Mutate(x =>
                    x.Resize(
                        new ResizeOptions { Size = new Size(600, 400), Mode = ResizeMode.Crop }
                    )
                );
                break;

            case ImageType.CategoryHeader:
                image.Mutate(x =>
                    x.Resize(
                        new ResizeOptions { Size = new Size(1200, 300), Mode = ResizeMode.Crop }
                    )
                );
                break;

            case ImageType.BlogFeatured:
                image.Mutate(x =>
                    x.Resize(
                        new ResizeOptions { Size = new Size(1200, 630), Mode = ResizeMode.Crop }
                    )
                );
                break;

            case ImageType.BlogContent:
                image.Mutate(x =>
                    x.Resize(
                        new ResizeOptions
                        {
                            Size = new Size(800, 0), // Width only, maintain aspect ratio
                            Mode = ResizeMode.Max,
                        }
                    )
                );
                break;

            case ImageType.Logo:
                // For logos, we might just want to optimize without resizing
                break;
        }

        return image;
    }

    private async Task SaveOptimizedImageAsync(Image image, string filePath, string extension)
    {
        IImageEncoder encoder = extension.ToLowerInvariant() switch
        {
            ".jpg" or ".jpeg" => new JpegEncoder { Quality = 80 }, // 80% quality is a good balance
            ".png" => new PngEncoder
            {
                CompressionLevel = PngCompressionLevel.BestCompression,
                TransparentColorMode = PngTransparentColorMode.Preserve,
            },
            _ => new WebpEncoder { Quality = 80 },
        };
        await using var outputStream = new FileStream(filePath, FileMode.Create);
        await image.SaveAsync(outputStream, encoder);
    }

    private bool ShouldPreservePngTransparency(IFormFile file, string extension)
    {
        // Only check PNGs since they might have transparency
        if (extension != ".png")
            return false;

        try
        {
            // Reset the position of the stream before reading
            using var stream = file.OpenReadStream();
            stream.Position = 0; // Add this line to reset the stream position
            using var image = Image.Load(stream);

            // Check if image has transparency
            return image.PixelType.AlphaRepresentation == PixelAlphaRepresentation.Unassociated;
        }
        catch
        {
            // If we can't determine, default to false
            return false;
        }
    }

    /// <summary>
    /// Gets the dimensions for a specified image type
    /// </summary>
    public (int width, int height) GetDimensionsForImageType(ImageType imageType)
    {
        return imageType switch
        {
            ImageType.ProductThumbnail => (300, 300),
            ImageType.ProductDetail => (800, 800),
            ImageType.Banner => (1600, 400),
            ImageType.BannerMobile => (800, 400),
            ImageType.Category => (600, 400),
            ImageType.CategoryHeader => (1200, 300),
            ImageType.BlogFeatured => (1200, 630),
            ImageType.BlogContent => (800, 0),
            ImageType.Logo => (0, 0), // No specific dimensions
            _ => (0, 0),
        };
    }
}

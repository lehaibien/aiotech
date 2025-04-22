using Application.Files;
using Application.Helpers;
using Application.Images;
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

public class ImageService : IImageService
{
    private const string ImageFolder = "images";
    private readonly string[] AllowedImageExtensions = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
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
        return Result<string>.Success(urlResult.Value);
    }

    public Result<List<string>> GetImageUrls(List<string> fileNames, string folderName)
    {
        var urlResult = _fileService.GetFileUrls(fileNames, Path.Combine(ImageFolder, folderName));
        if (urlResult.IsFailure)
        {
            return Result<List<string>>.Failure(urlResult.Message);
        }
        return Result<List<string>>.Success(urlResult.Value);
    }

    public Result<string> GetFileBase64(string fileName, string folderName)
    {
        var result = _fileService.GetFileBase64(fileName, Path.Combine(ImageFolder, folderName));
        if (result.IsFailure)
        {
            return Result<string>.Failure(result.Message);
        }
        return Result<string>.Success(result.Value);
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
        var baseFileName = $"{DateTime.UtcNow:yyyyMMddHHmmss}_{Guid.NewGuid().ToString()[..8]}";

        try
        {
            // Step 1: Upload original file
            var originalResult = await _fileService.UploadAsync(
                file,
                baseFolder,
                $"{baseFileName}_original",
                cancellationToken
            );

            if (!originalResult.IsSuccess)
            {
                return Result<string>.Failure(originalResult.Message);
            }

            var originalFileResult = originalResult.Value;

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
            var baseUrl = originalFileResult.FileUrl[
                ..(originalFileResult.FileUrl.LastIndexOf('/') + 1)
            ];

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
                results.Add(result.Value);
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
        var resizeOption = GetResizeOption(imageType);
        if (resizeOption is not null)
        {
            image.Mutate(x => x.Resize(resizeOption));
        }

        return image;
    }

    private async Task SaveOptimizedImageAsync(Image image, string filePath, string extension)
    {
        IImageEncoder encoder = extension.ToLowerInvariant() switch
        {
            ".jpg" or ".jpeg" => new JpegEncoder { Quality = 80 },
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
    public static ResizeOptions? GetResizeOption(ImageType imageType)
    {
        return imageType switch
        {
            ImageType.ProductThumbnail => new ResizeOptions
            {
                Size = new Size(300, 300),
                Mode = ResizeMode.Stretch,
            },
            ImageType.ProductDetail => new ResizeOptions
            {
                Size = new Size(800, 800),
                Mode = ResizeMode.Stretch,
            },
            ImageType.Banner => new ResizeOptions
            {
                Size = new Size(1200, 400),
                Mode = ResizeMode.Stretch,
            },
            ImageType.Branding => new ResizeOptions
            {
                Size = new Size(600, 400),
                Mode = ResizeMode.Stretch,
            },
            ImageType.BlogThumbnail => new ResizeOptions
            {
                Size = new Size(450, 300),
                Mode = ResizeMode.Stretch,
            },
            ImageType.Blog => new ResizeOptions
            {
                Size = new Size(1200, 630),
                Mode = ResizeMode.Stretch,
            },
            ImageType.Logo => null,
            _ => null,
        };
    }
}

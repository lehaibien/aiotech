using Application.Abstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Shared;
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Formats.Webp;
using SixLabors.ImageSharp.Processing;

namespace Application.Images;

public class StorageImageService : IStorageImageService
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
    private readonly IStorageService _storageService;
    private readonly ILogger<StorageImageService> _logger;

    public StorageImageService(IStorageService storageService, ILogger<StorageImageService> logger)
    {
        _storageService = storageService;
        _logger = logger;
    }

    public async Task<Result<StorageImageInfo>> UploadAsync(
        IFormFile file,
        ImageType imageType,
        string folderName,
        bool isPublic = true,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            var (image, width, height) = await LoadAndValidateImageAsync(file, cancellationToken);
            var optimizedImage = ProcessImage(image, imageType);
            var uniqueFileName = GenerateUniqueFileName(file.FileName);
            var fileUpload = await SaveImageAsFormFile(
                optimizedImage,
                uniqueFileName,
                cancellationToken
            );
            var objectPath = Path.Combine(ImageFolder, folderName);
            var uploadResult = await _storageService.UploadAsync(
                fileUpload,
                BucketName,
                objectPath,
                cancellationToken
            );

            var imageInfo = new StorageImageInfo(
                uploadResult.ObjectName,
                uploadResult.ContentType,
                uploadResult.Size,
                width,
                height,
                uploadResult.Url
            );

            _logger.LogInformation(
                "Image uploaded: {FileName} ({Width}x{Height})",
                uniqueFileName,
                width,
                height
            );

            return Result<StorageImageInfo>.Success(imageInfo);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("Upload failed: {Message}", ex.Message);
            return Result<StorageImageInfo>.Failure(ex.Message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Upload failed");
            throw;
        }
    }

    public async Task<Result<IEnumerable<StorageImageInfo>>> UploadBulkAsync(
        IEnumerable<IFormFile> files,
        ImageType imageType,
        string folderName,
        bool isPublic = true,
        CancellationToken cancellationToken = default
    )
    {
        var imageInfos = new List<StorageImageInfo>();
        var objectPath = Path.Combine(ImageFolder, folderName);

        foreach (var file in files)
        {
            try
            {
                var (image, width, height) = await LoadAndValidateImageAsync(
                    file,
                    cancellationToken
                );
                var optimizedImage = ProcessImage(image, imageType);
                var uniqueFileName = GenerateUniqueFileName(file.FileName);
                var fileUpload = await SaveImageAsFormFile(
                    optimizedImage,
                    uniqueFileName,
                    cancellationToken
                );
                var uploadResult = await _storageService.UploadAsync(
                    fileUpload,
                    BucketName,
                    objectPath,
                    cancellationToken
                );

                var imageInfo = new StorageImageInfo(
                    uploadResult.ObjectName,
                    uploadResult.ContentType,
                    uploadResult.Size,
                    width,
                    height,
                    uploadResult.Url
                );
                imageInfos.Add(imageInfo);

                _logger.LogInformation(
                    "Bulk image uploaded: {FileName} ({Width}x{Height})",
                    uniqueFileName,
                    width,
                    height
                );
            }
            catch (ArgumentException ex)
            {
                _logger.LogWarning(
                    "Bulk upload skipped file: {FileName} - {Message}",
                    file.FileName,
                    ex.Message
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Bulk upload failed for file: {FileName}", file.FileName);
                throw;
            }
        }

        if (imageInfos.Count == 0)
        {
            return Result<IEnumerable<StorageImageInfo>>.Failure("No valid images uploaded.");
        }

        return Result<IEnumerable<StorageImageInfo>>.Success(imageInfos);
    }

    public async Task<Result<string>> GetImageUrlAsync(
        string fileName,
        string folderName,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            var objectPath = Path.Combine(ImageFolder, folderName, fileName);
            var objectInfo = await _storageService.GetObjectInfoAsync(
                BucketName,
                objectPath,
                cancellationToken
            );

            if (objectInfo == null)
            {
                return Result<string>.Failure("Image not found");
            }

            return Result<string>.Success(objectInfo.Url);
        }
        catch (Exception ex)
        {
            return Result<string>.Failure($"Failed to get image URL: {ex.Message}");
        }
    }

    public async Task<Result<List<string>>> GetImageUrlsAsync(
        List<string> fileNames,
        string folderName,
        CancellationToken cancellationToken = default
    )
    {
        var urls = new List<string>();
        foreach (var fileName in fileNames)
        {
            var result = await GetImageUrlAsync(fileName, folderName, cancellationToken);
            if (result.IsFailure)
            {
                return Result<List<string>>.Failure(result.Message);
            }
            urls.Add(result.Value);
        }
        return Result<List<string>>.Success(urls);
    }

    public async Task<Result<string>> GetPresignedUrlAsync(
        string fileName,
        string folderName,
        int expirationInMinutes = 10,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            var objectPath = Path.Combine(ImageFolder, folderName, fileName);
            var presignedUrl = await _storageService.GetPresignedUrlAsync(
                BucketName,
                objectPath,
                expirationInMinutes,
                cancellationToken
            );
            return Result<string>.Success(presignedUrl);
        }
        catch (Exception ex)
        {
            return Result<string>.Failure($"Failed to get presigned URL: {ex.Message}");
        }
    }

    public async Task<Result<List<string>>> GetPresignedUrlsAsync(
        List<string> fileNames,
        string folderName,
        int expirationInMinutes = 10,
        CancellationToken cancellationToken = default
    )
    {
        var urls = new List<string>();
        foreach (var fileName in fileNames)
        {
            var result = await GetPresignedUrlAsync(
                fileName,
                folderName,
                expirationInMinutes,
                cancellationToken
            );
            if (result.IsFailure)
            {
                return Result<List<string>>.Failure(result.Message);
            }
            urls.Add(result.Value);
        }
        return Result<List<string>>.Success(urls);
    }

    public async Task<Result<string>> GetFileBase64Async(
        string fileName,
        string folderName,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            var objectPath = Path.Combine(ImageFolder, folderName, fileName);
            var objectInfo = await _storageService.GetObjectInfoAsync(
                BucketName,
                objectPath,
                cancellationToken
            );

            if (objectInfo == null)
            {
                return Result<string>.Failure("Image not found");
            }

            // TODO: Implement base64 conversion
            return Result<string>.Failure("Base64 conversion not implemented");
        }
        catch (Exception ex)
        {
            return Result<string>.Failure($"Failed to get file as base64: {ex.Message}");
        }
    }

    public async Task<Result> DeleteAsync(
        string fileName,
        string folderName,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            var objectPath = Path.Combine(ImageFolder, folderName, fileName);
            await _storageService.DeleteAsync(BucketName, objectPath, cancellationToken);
            return Result.Success();
        }
        catch (Exception ex)
        {
            return Result.Failure($"Failed to delete image: {ex.Message}");
        }
    }

    public async Task<Result> DeleteBulkAsync(
        List<string> fileNames,
        string folderName,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            var objectPaths = fileNames.Select(fileName =>
                Path.Combine(ImageFolder, folderName, fileName)
            );
            await _storageService.DeleteBulkAsync(BucketName, objectPaths, cancellationToken);
            return Result.Success();
        }
        catch (Exception ex)
        {
            return Result.Failure($"Failed to delete images: {ex.Message}");
        }
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
        var formFile = new FormFile(stream, 0, stream.Length, "image", fileName);
        return formFile;
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

using Microsoft.AspNetCore.Http;
using Shared;

namespace Application.Images;

public interface IStorageImageService
{
    Task<Result<StorageImageInfo>> UploadAsync(
        IFormFile file,
        ImageType imageType,
        string folderName,
        bool isPublic = true,
        CancellationToken cancellationToken = default
    );

    Task<Result<IEnumerable<StorageImageInfo>>> UploadBulkAsync(
        IEnumerable<IFormFile> files,
        ImageType imageType,
        string folderName,
        bool isPublic = true,
        CancellationToken cancellationToken = default
    );

    Task<Result<string>> GetImageUrlAsync(
        string fileName,
        string folderName,
        CancellationToken cancellationToken = default
    );

    Task<Result<List<string>>> GetImageUrlsAsync(
        List<string> fileNames,
        string folderName,
        CancellationToken cancellationToken = default
    );

    Task<Result<string>> GetPresignedUrlAsync(
        string fileName,
        string folderName,
        int expirationInMinutes = 10,
        CancellationToken cancellationToken = default
    );

    Task<Result<List<string>>> GetPresignedUrlsAsync(
        List<string> fileNames,
        string folderName,
        int expirationInMinutes = 10,
        CancellationToken cancellationToken = default
    );

    Task<Result<string>> GetFileBase64Async(
        string fileName,
        string folderName,
        CancellationToken cancellationToken = default
    );

    Task<Result> DeleteAsync(
        string fileName,
        string folderName,
        CancellationToken cancellationToken = default
    );

    Task<Result> DeleteBulkAsync(
        List<string> fileNames,
        string folderName,
        CancellationToken cancellationToken = default
    );
}

public record StorageImageInfo(
    string FileName,
    string ContentType,
    long Size,
    int Width,
    int Height,
    string Url
);

using Microsoft.AspNetCore.Http;
using Shared;

namespace Application.Images;

public interface IImageService
{
    Result<string> GetImageUrl(string fileName, string folderName);
    Result<List<string>> GetImageUrls(List<string> fileNames, string folderName);
    Result<string> GetFileBase64(string fileName, string folderName);
    Task<Result<string>> UploadAsync(
        IFormFile file,
        ImageType imageType,
        string folderName,
        CancellationToken cancellationToken = default
    );
    Task<Result<List<string>>> UploadBulkAsync(
        List<IFormFile> files,
        ImageType imageType,
        string folderName,
        CancellationToken cancellationToken = default
    );
    Result Delete(string fileName, string folderName);
    Result DeleteBulk(List<string> filePaths, string folderName);
    Result DeleteByUrl(string url);
    Result DeleteBulkByUrl(List<string> urls);
}

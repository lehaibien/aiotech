using Microsoft.AspNetCore.Http;
using Shared;

namespace Application.Files;

public interface IFileService
{
    Result<string> GetFileUrl(string fileName, string folderName);
    Result<List<string>> GetFileUrls(List<string> fileNames, string folderName);
    Result<string> GetFileBase64(string fileName, string folderName);
    Task<Result<FileUploadResult>> UploadAsync(
        IFormFile file,
        string folderName,
        string? fileName = null,
        CancellationToken cancellationToken = default
    );

    Task<Result<List<FileUploadResult>>> UploadBulkAsync(
        List<IFormFile> files,
        string folderName,
        string? fileName = null,
        CancellationToken cancellationToken = default
    );
    Result Delete(string fileName, string folderName);
    Result DeleteBulk(List<string> fileNames, string folderName);

    Result DeleteByUrl(string fileUrl);

    Result DeleteBulkByUrl(List<string> fileUrls);
    Result DeleteFolder(string folderName);
    void EnsureDirectoryExists(string folder);
}

public class FileUploadResult
{
    public string FileName { get; set; } = string.Empty;
    public string FilePath { get; set; } = string.Empty;
    public string FileUrl { get; set; } = string.Empty;
}

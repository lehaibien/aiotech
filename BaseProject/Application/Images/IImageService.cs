using Microsoft.AspNetCore.Http;
using Shared;

namespace Application.Images;

public interface IImageService
{
    Task<Result<string>> UploadAsync(IFormFile file, string folderName);
    Task<Result<List<string>>> UploadListAsync(List<IFormFile> files, string folderName);
    Result<string> GetFileBase64(string filePath);
    Task<Result<string>> Delete(string filePath);
    Task<Result<string>> DeleteList(List<string> filePaths);
}
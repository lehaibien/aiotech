using Microsoft.AspNetCore.Http;
using Shared;

namespace Application.Files;

public interface IFileService
{
    public Task<Result<string>> GetFileUrlAsync(string fileName, string folderName);
    public Task<Result<FileMetadata>> GetFileMetadataAsync(string fileName, string folderName);
    public Task<Result> UploadAsync(IFormFile file, string folderName);
    public Task<Result> DeleteAsync(string fileName, string folderName);
}
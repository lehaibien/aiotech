using Application.Files;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Shared;

namespace Infrastructure.Files;

public class FileService : IFileService
{
    private readonly IWebHostEnvironment _webHostEnvironment;

    public FileService(IWebHostEnvironment webHostEnvironment)
    {
        _webHostEnvironment = webHostEnvironment;
    }

    private readonly string Url =
        Environment.GetEnvironmentVariable("BE_StaticUrl") ?? "http://localhost:5554/static";

    public Result<string> GetFileUrl(string fileName, string folderName)
    {
        var filePath = Path.Combine(_webHostEnvironment.WebRootPath, folderName, fileName);
        if (File.Exists(filePath))
        {
            return Result<string>.Success(Path.Combine(Url, folderName, fileName));
        }
        return Result<string>.Failure("File not found");
    }

    public Result<List<string>> GetFileUrls(List<string> fileNames, string folderName)
    {
        List<string> filePaths = [];
        foreach (var fileName in fileNames)
        {
            var filePath = Path.Combine(_webHostEnvironment.WebRootPath, folderName, fileName);
            if (File.Exists(filePath))
            {
                filePaths.Add(Path.Combine(Url, folderName, fileName));
            }
        }
        return Result<List<string>>.Success(filePaths);
    }

    public Result<string> GetFileBase64(string fileName, string folderName)
    {
        var filePath = Path.Combine(_webHostEnvironment.WebRootPath, folderName, fileName);
        if (File.Exists(filePath))
        {
            var bytes = File.ReadAllBytes(filePath);
            var base64 = Convert.ToBase64String(bytes);
            return Result<string>.Success(base64);
        }
        return Result<string>.Failure("File not found");
    }

    public async Task<Result<FileUploadResult>> UploadAsync(
        IFormFile file,
        string folderName,
        string? fileName = null,
        CancellationToken cancellationToken = default
    )
    {
        if (file == null || file.Length <= 0)
        {
            return Result<FileUploadResult>.Failure("Empty file provided");
        }

        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        // Create folder structure
        var folderPath = Path.Combine(_webHostEnvironment.WebRootPath, folderName);
        EnsureDirectoryExists(folderPath);

        // Generate filename if not provided
        fileName ??= $"{DateTime.UtcNow:yyyyMMddHHmmss}_{Guid.NewGuid().ToString().Substring(0, 8)}";
        var fullFileName = $"{fileName}{extension}";
        var filePath = Path.Combine(folderPath, fullFileName);

        try
        {
            await using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream, cancellationToken);
            var fileUploadResult = new FileUploadResult
            {
                FileName = fullFileName,
                FilePath = filePath,
                FileUrl = Path.Combine(Url, folderName, fullFileName),
            };

            return Result<FileUploadResult>.Success(fileUploadResult);
        }
        catch (Exception ex)
        {
            TryDeleteFile(filePath);
            return Result<FileUploadResult>.Failure($"File upload failed: {ex.Message}");
        }
    }

    public async Task<Result<List<FileUploadResult>>> UploadBulkAsync(
        List<IFormFile> files,
        string folderName,
        string? fileName = null,
        CancellationToken cancellationToken = default
    )
    {
        List<FileUploadResult> filePaths = [];
        foreach (var file in files)
        {
            var result = await UploadAsync(file, folderName, fileName, cancellationToken);
            if (result.IsFailure)
            {
                return Result<List<FileUploadResult>>.Failure(result.Message);
            }
            filePaths.Add(result.Data);
        }
        return Result<List<FileUploadResult>>.Success(filePaths);
    }

    public Result Delete(string fileName, string folderName)
    {
        var filePath = Path.Combine(_webHostEnvironment.WebRootPath, folderName, fileName);
        if (File.Exists(filePath))
        {
            File.Delete(filePath);
        }
        return Result.Success();
    }

    public Result DeleteBulk(List<string> fileNames, string folderName)
    {
        foreach (var fileName in fileNames)
        {
            var result = Delete(fileName, folderName);
            if (result.IsFailure)
            {
                return Result.Failure(fileName + ": " + result.Message);
            }
        }
        return Result.Success();
    }

    public Result DeleteByUrl(string fileUrl)
    {
        if (string.IsNullOrEmpty(fileUrl))
        {
            return Result.Failure("File url is required");
        }

        if (!fileUrl.StartsWith(Url))
        {
            return Result.Failure("Invalid file url");
        }

        var result = DeleteFileByUrl(fileUrl);
        // if (!result)
        // {
        //     return Result.Failure("File not found");
        // }

        return Result.Success();
    }

    public Result DeleteBulkByUrl(List<string> fileUrls)
    {
        foreach (var fileUrl in fileUrls)
        {
            var result = DeleteFileByUrl(fileUrl);
            // if (!result)
            // {
            //     return Result.Failure(fileUrl + ": File not found");
            // }
        }

        return Result.Success();
    }

    public Result DeleteFolder(string folderName)
    {
        var folderPath = Path.Combine(_webHostEnvironment.WebRootPath, folderName);
        if (!Directory.Exists(folderPath))
        {
            return Result.Failure("Folder not found");
        }
        Directory.Delete(folderPath, recursive: true);
        return Result.Success();
    }

    public void EnsureDirectoryExists(string folder)
    {
        if (!Directory.Exists(folder))
        {
            Directory.CreateDirectory(folder);
        }
    }

    private bool DeleteFileByUrl(string fileUrl)
    {
        try
        {
            var filePath = GetPhysicalPath(fileUrl);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
                return true;
            }
            return false;
        }
        catch
        {
            return false;
        }
    }

    private string GetPhysicalPath(string fileUrl)
    {
        var uri = new Uri(fileUrl);
        var relativePath = uri.AbsolutePath.TrimStart('/').Replace("static/", "");

        return Path.Combine(_webHostEnvironment.WebRootPath, relativePath);
    }

    private void TryDeleteFile(string filePath)
    {
        try
        {
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
        catch
        {
            // Ignore deletion errors during cleanup
        }
    }
}

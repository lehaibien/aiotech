using AutoDependencyRegistration.Attributes;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Shared;

namespace Application.Images;

[RegisterClassAsSingleton]
public class ImageService : IImageService
{
    private readonly IWebHostEnvironment _webHostEnvironment;
    private readonly string Url =
        Environment.GetEnvironmentVariable("BE_StaticUrl") ?? "http://localhost:5554/static";

    public ImageService(IWebHostEnvironment webHostEnvironment)
    {
        _webHostEnvironment = webHostEnvironment;
    }

    public async Task<Result<string>> UploadAsync(IFormFile file, string folderName)
    {
        var folderPath = $"{_webHostEnvironment.WebRootPath}/images/{folderName}";
        if (!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath);
        }
        // generate random file name
        var fileName = DateTime.Now.ToString("yyyyMMddHHmmss") + Path.GetExtension(file.FileName);
        var filePath = Path.Combine(folderPath, fileName);
        if (file.Length <= 0)
        {
            return Result<string>.Failure("File rỗng");
        }
        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);
        return Result<string>.Success($"{Url}/images/{folderName}/{fileName}");
    }

    public async Task<Result<List<string>>> UploadListAsync(
        List<IFormFile> files,
        string folderName
    )
    {
        List<string> filePaths = [];
        var folderPath = $"{_webHostEnvironment.WebRootPath}/images/{folderName}";
        if (!Directory.Exists(folderPath))
        {
            Directory.CreateDirectory(folderPath);
        }
        foreach (var file in files)
        {
            var fileName = file.FileName;
            var filePath = Path.Combine(folderPath, fileName);
            if (file.Length <= 0)
            {
                return Result<List<string>>.Failure("File rỗng");
            }
            await using var stream = new FileStream(filePath, FileMode.Create);
            await file.CopyToAsync(stream);
            filePaths.Add($"{Url}/images/{folderName}/{fileName}");
        }

        return Result<List<string>>.Success(filePaths);
    }

    public Result<string> GetFileBase64(string filePath)
    {
        // extract file path
        var truePath = filePath.Replace(Url, _webHostEnvironment.WebRootPath);
        var file = new FileInfo(filePath);
        if (!file.Exists)
        {
            return Result<string>.Failure("File not found");
        }
        // read file and convert to base64
        var image = File.OpenRead(filePath);
        var bytes = new byte[image.Length];
        var _ = image.Read(bytes, 0, (int)image.Length);
        var base64 = "data:image/png;base64," + Convert.ToBase64String(bytes);
        image.Close();
        return Result<string>.Success(base64);
    }

    public async Task<Result<string>> Delete(string filePath)
    {
        var truePath = filePath.Replace(Url, _webHostEnvironment.WebRootPath);
        var file = new FileInfo(truePath);
        if (file.Exists)
        {
            file.Delete();
        }
        else
        {
            return Result<string>.Failure("File not found");
        }
        return Result<string>.Success("Deleted");
    }

    public async Task<Result<string>> DeleteList(List<string> filePaths)
    {
        foreach (var path in filePaths)
        {
            var truePath = path.Replace(Url, _webHostEnvironment.WebRootPath);
            var file = new FileInfo(truePath);
            if (file.Exists)
            {
                file.Delete();
            }
            else
            {
                return Result<string>.Failure("File not found");
            }
        }
        return Result<string>.Success("Deleted");
    }
}

using Microsoft.AspNetCore.Http;
using Application.Shared;

namespace Application.Images;

public interface IImageService
{
    Task<Result<IFormFile>> OptimizeAsync(
        IFormFile file,
        ImageType imageType,
        string? prefix = null,
        CancellationToken cancellationToken = default
    );
    Task<Result<IEnumerable<IFormFile>>> OptimizeBulkAsync(
        IEnumerable<IFormFile> files,
        ImageType imageType,
        string? prefix = null,
        CancellationToken cancellationToken = default
    );
}

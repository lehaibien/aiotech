using Microsoft.AspNetCore.Http;
using Shared;

namespace Application.Images;

public interface IImageService
{
    /// <summary>
    /// Optimizes a single image file asynchronously according to the specified image type.
    /// </summary>
    /// <param name="file">The image file to optimize.</param>
    /// <param name="imageType">The type of image optimization to apply.</param>
    /// <param name="prefix">An optional prefix to apply to the optimized file's name.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>A result containing the optimized image file.</returns>
    Task<Result<IFormFile>> OptimizeAsync(
        IFormFile file,
        ImageType imageType,
        string? prefix = null,
        CancellationToken cancellationToken = default
    );
    /// <summary>
    /// Optimizes a collection of image files asynchronously according to the specified image type.
    /// </summary>
    /// <param name="files">The image files to be optimized.</param>
    /// <param name="imageType">The type of image optimization to apply.</param>
    /// <param name="prefix">An optional prefix to apply to the optimized files.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>A task that resolves to a result containing the optimized image files.</returns>
    Task<Result<IEnumerable<IFormFile>>> OptimizeBulkAsync(
        IEnumerable<IFormFile> files,
        ImageType imageType,
        string? prefix = null,
        CancellationToken cancellationToken = default
    );
}

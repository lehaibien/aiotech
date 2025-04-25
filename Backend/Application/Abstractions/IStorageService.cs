using Microsoft.AspNetCore.Http;

namespace Application.Abstractions;

public interface IStorageService
{
    /// <summary>
    /// Generates a pre-signed URL for temporary access to an object
    /// </summary>
    Task<string> GetPresignedUrlAsync(
        string bucket,
        string objectName,
        int expirationInMinutes = 10,
        string? folder = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Uploads a single file to storage
    /// </summary>
    Task<StorageObjectInfo> UploadAsync(
        IFormFile file,
        string bucket,
        string? folder = null,
        string? prefix = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Uploads multiple files in parallel
    /// </summary>
    Task<IEnumerable<StorageObjectInfo>> UploadBulkAsync(
        IEnumerable<IFormFile> files,
        string bucket,
        string? folder = null,
        string? prefix = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Deletes a single object from storage
    /// </summary>
    Task DeleteAsync(
        string bucket,
        string objectName,
        string? folder = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Deletes multiple objects in parallel
    /// </summary>
    Task DeleteBulkAsync(
        string bucket,
        IEnumerable<string> objectNames,
        string? folder = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Deletes an object from storage using its URL
    /// </summary>
    Task DeleteFromUrlAsync(string url, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes multiple objects in parallel using their URLs
    /// </summary>
    Task DeleteBulkFromUrlAsync(
        IEnumerable<string> urls,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Checks if an object exists in storage
    /// </summary>
    Task<bool> ExistsAsync(
        string bucket,
        string objectName,
        string? folder = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Gets object metadata
    /// </summary>
    Task<StorageObjectInfo?> GetObjectInfoAsync(
        string bucket,
        string objectName,
        string? folder = null,
        CancellationToken cancellationToken = default
    );
}

public record StorageObjectInfo(string ObjectName, string ContentType, long Size, string Url);

using Microsoft.AspNetCore.Http;

namespace Application.Abstractions;

public interface IStorageService
{
    /// <summary>
    /// Generates a pre-signed URL for temporary access to an object
    /// <summary>
    /// Generates a temporary pre-signed URL for accessing a storage object.
    /// </summary>
    /// <param name="bucket">The name of the storage bucket containing the object.</param>
    /// <param name="objectName">The name of the object to access.</param>
    /// <param name="expirationInMinutes">The number of minutes the pre-signed URL remains valid. Defaults to 10.</param>
    /// <param name="folder">Optional folder path within the bucket.</param>
    /// <param name="cancellationToken">Token to cancel the operation.</param>
    /// <returns>A pre-signed URL granting temporary access to the specified object.</returns>
    Task<string> GetPresignedUrlAsync(
        string bucket,
        string objectName,
        int expirationInMinutes = 10,
        string? folder = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Uploads a single file to storage
    /// <summary>
    /// Asynchronously uploads a file to the specified storage bucket and returns metadata about the uploaded object.
    /// </summary>
    /// <param name="file">The file to upload.</param>
    /// <param name="bucket">The name of the storage bucket.</param>
    /// <param name="folder">Optional folder within the bucket to store the file.</param>
    /// <param name="prefix">Optional prefix to prepend to the object name.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>Metadata about the uploaded storage object.</returns>
    Task<StorageObjectInfo> UploadAsync(
        IFormFile file,
        string bucket,
        string? folder = null,
        string? prefix = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Uploads multiple files in parallel
    /// <summary>
    /// Uploads multiple files to the specified storage bucket, optionally placing them in a folder and applying a prefix to object names.
    /// </summary>
    /// <param name="files">The collection of files to upload.</param>
    /// <param name="bucket">The name of the target storage bucket.</param>
    /// <param name="folder">Optional folder within the bucket to store the files.</param>
    /// <param name="prefix">Optional prefix to prepend to each object's name.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>A collection of metadata for the uploaded storage objects.</returns>
    Task<IEnumerable<StorageObjectInfo>> UploadBulkAsync(
        IEnumerable<IFormFile> files,
        string bucket,
        string? folder = null,
        string? prefix = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Deletes a single object from storage
    /// <summary>
    /// Deletes a single object from the specified storage bucket and optional folder.
    /// </summary>
    Task DeleteAsync(
        string bucket,
        string objectName,
        string? folder = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Deletes multiple objects in parallel
    /// <summary>
    /// Deletes multiple objects from the specified storage bucket, optionally within a folder.
    /// </summary>
    Task DeleteBulkAsync(
        string bucket,
        IEnumerable<string> objectNames,
        string? folder = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Deletes an object from storage using its URL
    /// <summary>
/// Deletes a storage object identified by its URL.
/// </summary>
    Task DeleteFromUrlAsync(string url, CancellationToken cancellationToken = default);

    /// <summary>
    /// Deletes multiple objects in parallel using their URLs
    /// <summary>
    /// Deletes multiple objects from storage using their URLs.
    /// </summary>
    Task DeleteBulkFromUrlAsync(
        IEnumerable<string> urls,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Checks if an object exists in storage
    /// <summary>
    /// Determines whether a specified object exists in the given storage bucket and optional folder.
    /// </summary>
    /// <param name="bucket">The name of the storage bucket.</param>
    /// <param name="objectName">The name of the object to check for existence.</param>
    /// <param name="folder">An optional folder within the bucket.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>True if the object exists; otherwise, false.</returns>
    Task<bool> ExistsAsync(
        string bucket,
        string objectName,
        string? folder = null,
        CancellationToken cancellationToken = default
    );

    /// <summary>
    /// Gets object metadata
    /// <summary>
    /// Retrieves metadata for a specified object in a storage bucket.
    /// </summary>
    /// <param name="bucket">The name of the storage bucket.</param>
    /// <param name="objectName">The name of the object to retrieve metadata for.</param>
    /// <param name="folder">Optional folder within the bucket where the object is located.</param>
    /// <param name="cancellationToken">Token to cancel the asynchronous operation.</param>
    /// <returns>The metadata of the object if it exists; otherwise, null.</returns>
    Task<StorageObjectInfo?> GetObjectInfoAsync(
        string bucket,
        string objectName,
        string? folder = null,
        CancellationToken cancellationToken = default
    );
}

public record StorageObjectInfo(string ObjectName, string ContentType, long Size, string Url);

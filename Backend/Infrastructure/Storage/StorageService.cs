using Application.Abstractions;
using Microsoft.AspNetCore.Http;
using Minio;
using Minio.DataModel.Args;

namespace Infrastructure.Storage;

public class StorageService : IStorageService
{
    private readonly IMinioClient _minioClient;
    private const string DEFAULT_PATH = "http://localhost:9000";

    /// <summary>
    /// Initializes a new instance of the <see cref="StorageService"/> using the specified MinIO client.
    /// </summary>
    public StorageService(IMinioClient minioClient)
    {
        _minioClient = minioClient;
    }

    /// <summary>
    /// Generates a presigned URL for accessing an object in the specified bucket, with optional folder prefix and configurable expiration time.
    /// </summary>
    /// <param name="bucket">The name of the bucket containing the object.</param>
    /// <param name="objectName">The name of the object for which to generate the URL.</param>
    /// <param name="expirationInMinutes">The number of minutes until the URL expires. Defaults to 10.</param>
    /// <param name="folder">Optional folder path to prepend to the object name.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>A presigned URL granting temporary access to the object.</returns>
    public async Task<string> GetPresignedUrlAsync(
        string bucket,
        string objectName,
        int expirationInMinutes = 10,
        string? folder = null,
        CancellationToken cancellationToken = default
    )
    {
        if (!string.IsNullOrWhiteSpace(folder))
        {
            objectName = $"{folder}/{objectName}";
        }

        var obj = new PresignedGetObjectArgs()
            .WithBucket(bucket)
            .WithObject(objectName)
            .WithExpiry(expirationInMinutes);

        return await _minioClient.PresignedGetObjectAsync(obj);
    }

    /// <summary>
    /// Retrieves metadata for an object in the specified bucket, returning information such as content type, size, and URL, or null if the object does not exist.
    /// </summary>
    /// <param name="bucket">The name of the bucket containing the object.</param>
    /// <param name="objectName">The name of the object to retrieve metadata for.</param>
    /// <param name="folder">Optional folder path to prepend to the object name.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>A <see cref="StorageObjectInfo"/> with object metadata, or null if the object is not found or an error occurs.</returns>
    public async Task<StorageObjectInfo?> GetObjectInfoAsync(
        string bucket,
        string objectName,
        string? folder = null,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            if (!string.IsNullOrWhiteSpace(folder))
            {
                objectName = $"{folder}/{objectName}";
            }

            var obj = new StatObjectArgs().WithBucket(bucket).WithObject(objectName);

            var info = await _minioClient.StatObjectAsync(obj, cancellationToken);

            return new StorageObjectInfo(
                objectName,
                info.ContentType,
                info.Size,
                $"{DEFAULT_PATH}/{bucket}/{objectName}"
            );
        }
        catch (Exception)
        {
            return null;
        }
    }

    /// <summary>
    /// Uploads a file to the specified bucket, optionally placing it within a folder and/or prefix, and returns information about the uploaded object.
    /// </summary>
    /// <param name="file">The file to upload.</param>
    /// <param name="bucket">The name of the bucket to upload the file to.</param>
    /// <param name="folder">Optional folder path within the bucket.</param>
    /// <param name="prefix">Optional prefix to prepend to the file name.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>Information about the uploaded object, including its name, content type, size, and URL.</returns>
    /// <exception cref="Exception">Thrown if the upload fails.</exception>
    public async Task<StorageObjectInfo> UploadAsync(
        IFormFile file,
        string bucket,
        string? folder = null,
        string? prefix = null,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            var objectName = string.IsNullOrWhiteSpace(prefix)
                ? file.FileName
                : $"{prefix}/{file.FileName}";
            
            if (!string.IsNullOrWhiteSpace(folder))
            {
                objectName = $"{folder}/{objectName}";
            }

            var contentType = GetFileContentType(file);

            var stream = file.OpenReadStream();

            var putObjectArgs = new PutObjectArgs()
                .WithBucket(bucket)
                .WithObject(objectName)
                .WithStreamData(stream)
                .WithObjectSize(file.Length)
                .WithContentType(contentType);

            await _minioClient.PutObjectAsync(putObjectArgs, cancellationToken);

            return new StorageObjectInfo(
                objectName,
                contentType,
                file.Length,
                $"{DEFAULT_PATH}/{bucket}/{objectName}"
            );
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to upload file: {ex.Message}", ex);
        }
    }

    /// <summary>
    /// Uploads multiple files to the specified bucket concurrently.
    /// </summary>
    /// <param name="files">The collection of files to upload.</param>
    /// <param name="bucket">The target bucket name.</param>
    /// <param name="folder">Optional folder path to prepend to each object name.</param>
    /// <param name="prefix">Optional prefix to prepend to each object name.</param>
    /// <param name="cancellationToken">Token to observe for cancellation.</param>
    /// <returns>A collection of <see cref="StorageObjectInfo"/> for successfully uploaded files, or an empty collection if an error occurs.</returns>
    public async Task<IEnumerable<StorageObjectInfo>> UploadBulkAsync(
        IEnumerable<IFormFile> files,
        string bucket,
        string? folder = null,
        string? prefix = null,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            var tasks = new List<Task<StorageObjectInfo>>();

            foreach (var file in files)
            {
                var task = UploadAsync(file, bucket, folder, cancellationToken: cancellationToken);

                tasks.Add(task);
            }

            return await Task.WhenAll(tasks);
        }
        catch (Exception)
        {
            return [];
        }
    }

    /// <summary>
    /// Deletes an object from storage using its URL.
    /// </summary>
    /// <param name="url">The URL of the object to delete.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    public async Task DeleteFromUrlAsync(string url, CancellationToken cancellationToken = default)
    {
        var uri = new Uri(url);
        var bucket = uri.Segments[1].Trim('/');
        var objectName = uri.Segments.Skip(2).Aggregate((a, b) => a + b);

        await DeleteAsync(bucket, objectName, null, cancellationToken);
    }

    /// <summary>
    /// Deletes multiple objects from storage by parsing their URLs and removing each corresponding object.
    /// </summary>
    /// <param name="urls">A collection of object URLs to delete.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    public async Task DeleteBulkFromUrlAsync(
        IEnumerable<string> urls,
        CancellationToken cancellationToken = default
    )
    {
        var tasks = new List<Task>();

        foreach (var url in urls)
        {
            var uri = new Uri(url);
            var bucket = uri.Segments[1].Trim('/');
            var objectName = uri.Segments.Skip(2).Aggregate((a, b) => a + b);

            var task = DeleteAsync(bucket, objectName, null, cancellationToken);

            tasks.Add(task);
        }
        await Task.WhenAll(tasks);
    }

    /// <summary>
    /// Checks whether a specified object exists in a given bucket.
    /// </summary>
    /// <param name="bucket">The name of the bucket to search in.</param>
    /// <param name="objectName">The name of the object to check for existence.</param>
    /// <param name="folder">Optional folder path to prepend to the object name.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <returns>True if the object exists; otherwise, false.</returns>
    public async Task<bool> ExistsAsync(
        string bucket,
        string objectName,
        string? folder = null,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            if (!string.IsNullOrWhiteSpace(folder))
            {
                objectName = $"{folder}/{objectName}";
            }

            var statObjectArgs = new StatObjectArgs().WithBucket(bucket).WithObject(objectName);

            await _minioClient.StatObjectAsync(statObjectArgs, cancellationToken);
            return true;
        }
        catch (Exception)
        {
            return false;
        }
    }

    /// <summary>
    /// Deletes an object from the specified bucket, optionally within a folder.
    /// </summary>
    /// <param name="bucket">The name of the bucket containing the object.</param>
    /// <param name="objectName">The name of the object to delete.</param>
    /// <param name="folder">Optional folder path within the bucket.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <exception cref="Exception">Thrown if the deletion fails.</exception>
    public async Task DeleteAsync(
        string bucket,
        string objectName,
        string? folder = null,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            if (!string.IsNullOrWhiteSpace(folder))
            {
                objectName = $"{folder}/{objectName}";
            }

            var removeObjectArgs = new RemoveObjectArgs().WithBucket(bucket).WithObject(objectName);

            await _minioClient.RemoveObjectAsync(removeObjectArgs, cancellationToken);
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to delete object: {ex.Message}", ex);
        }
    }

    /// <summary>
    /// Deletes multiple objects from the specified bucket, optionally within a folder.
    /// </summary>
    /// <param name="bucket">The name of the bucket containing the objects.</param>
    /// <param name="objectNames">A collection of object names to delete.</param>
    /// <param name="folder">Optional folder path to prepend to each object name.</param>
    /// <param name="cancellationToken">Token to monitor for cancellation requests.</param>
    /// <exception cref="AggregateException">Thrown if one or more objects fail to delete.</exception>
    /// <exception cref="Exception">Thrown if the deletion operation fails.</exception>
    public async Task DeleteBulkAsync(
        string bucket,
        IEnumerable<string> objectNames,
        string? folder = null,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            if (!string.IsNullOrWhiteSpace(folder))
            {
                objectNames = objectNames.Select(x => $"{folder}/{x}");
            }

            var removeObjectsArgs = new RemoveObjectsArgs()
                .WithBucket(bucket)
                .WithObjects(objectNames.ToList());

            var errors = await _minioClient.RemoveObjectsAsync(
                removeObjectsArgs,
                cancellationToken
            );

            if (errors.Any())
            {
                throw new AggregateException(
                    "Failed to delete some objects",
                    errors.Select(e => new Exception(e.Message))
                );
            }
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to delete objects: {ex.Message}", ex);
        }
    }

    /// <summary>
    /// Returns the MIME content type for the given file based on its extension.
    /// </summary>
    /// <param name="file">The file whose content type is to be determined.</param>
    /// <returns>The MIME type as a string, or "application/octet-stream" if the extension is unrecognized.</returns>
    private static string GetFileContentType(IFormFile file)
    {
        var fileExtension = Path.GetExtension(file.FileName);
        return fileExtension switch
        {
            ".jpg" or ".jpeg" => "image/jpeg",
            ".png" => "image/png",
            ".gif" => "image/gif",
            _ => "application/octet-stream",
        };
    }
}

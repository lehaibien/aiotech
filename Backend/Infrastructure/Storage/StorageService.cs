using Application.Abstractions;
using Microsoft.AspNetCore.Http;
using Minio;
using Minio.DataModel.Args;

namespace Infrastructure.Storage;

public class StorageService : IStorageService
{
    private readonly IMinioClient _minioClient;
    private const string DEFAULT_PATH = "http://localhost:9000";

    public StorageService(IMinioClient minioClient)
    {
        _minioClient = minioClient;
    }

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

    public async Task DeleteFromUrlAsync(string url, CancellationToken cancellationToken = default)
    {
        var uri = new Uri(url);
        var bucket = uri.Segments[1].Trim('/');
        var objectName = uri.Segments.Skip(2).Aggregate((a, b) => a + b);

        await DeleteAsync(bucket, objectName, null, cancellationToken);
    }

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

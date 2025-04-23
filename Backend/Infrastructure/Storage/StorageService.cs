using Application.Abstractions;
using Microsoft.AspNetCore.Http;
using Minio;
using Minio.DataModel.Args;

namespace Infrastructure.Storage;

public class StorageService : IStorageService
{
    private readonly IMinioClient _minioClient;

    public StorageService(IMinioClient minioClient)
    {
        _minioClient = minioClient;
    }

    public async Task<string> GetPresignedUrlAsync(
        string bucket,
        string objectName,
        int expirationInMinutes = 10,
        CancellationToken cancellationToken = default
    )
    {
        var obj = new PresignedGetObjectArgs()
            .WithBucket(bucket)
            .WithObject(objectName)
            .WithExpiry(expirationInMinutes);

        var url = await _minioClient.PresignedGetObjectAsync(obj);

        return url;
    }

    public async Task<StorageObjectInfo?> GetObjectInfoAsync(
        string bucket,
        string objectName,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            var obj = new StatObjectArgs().WithBucket(bucket).WithObject(objectName);

            var info = await _minioClient.StatObjectAsync(obj, cancellationToken);

            return new StorageObjectInfo(
                objectName,
                info.ContentType,
                info.Size,
                info.ETag,
                info.LastModified,
                await GetPresignedUrlAsync(bucket, objectName, cancellationToken: cancellationToken)
            );
        }
        catch (Exception)
        {
            return null;
        }
    }

    public async Task<IEnumerable<StorageObjectInfo>> UploadBulkAsync(
        IEnumerable<IFormFile> files,
        string bucket,
        string? prefix = null,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            var tasks = new List<Task<StorageObjectInfo>>();

            foreach (var file in files)
            {
                var objectName = $"{prefix}/{file.FileName}";

                var task = UploadAsync(file, bucket, objectName, cancellationToken);

                tasks.Add(task);
            }

            var results = await Task.WhenAll(tasks);

            return results;
        }
        catch (Exception)
        {
            return [];
        }
    }

    public async Task<StorageObjectInfo> UploadAsync(
        IFormFile file,
        string bucket,
        string? prefix = null,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
            var objectName = string.IsNullOrEmpty(prefix)
                ? file.FileName
                : $"{prefix}/{file.FileName}";

            var putObjectArgs = new PutObjectArgs()
                .WithBucket(bucket)
                .WithObject(objectName)
                .WithStreamData(file.OpenReadStream())
                .WithObjectSize(file.Length)
                .WithContentType(file.ContentType);

            await _minioClient.PutObjectAsync(putObjectArgs, cancellationToken);

            return await GetObjectInfoAsync(bucket, objectName, cancellationToken)
                ?? throw new Exception("Failed to get uploaded object info");
        }
        catch (Exception ex)
        {
            throw new Exception($"Failed to upload file: {ex.Message}", ex);
        }
    }

    public async Task<bool> ExistsAsync(
        string bucket,
        string objectName,
        CancellationToken cancellationToken = default
    )
    {
        try
        {
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
        CancellationToken cancellationToken = default
    )
    {
        try
        {
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
        CancellationToken cancellationToken = default
    )
    {
        try
        {
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
}

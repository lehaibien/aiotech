using Application.Files;
using Microsoft.AspNetCore.Http;
using Minio;
using Minio.DataModel.Args;
using Minio.Exceptions;
using Shared;

namespace Infrastructure.Storage;

public class FileService : IFileService
{
    private const string BucketName = "ecommerce";
    private const int MaxFileSize = 5 * 1024 * 1024; // 5MB
    private readonly IMinioClient _minioClient;

    public FileService(IMinioClient minioClient)
    {
        _minioClient = minioClient;
    }

    public async Task<Result<string>> GetFileUrlAsync(string fileName, string folderName)
    {
        var filePath = Path.Combine(folderName, fileName);
        var getObjectArgs = new PresignedGetObjectArgs()
            .WithBucket(BucketName)
            .WithExpiry(Convert.ToInt32(TimeSpan.FromDays(1).TotalSeconds))
            .WithObject(filePath);
        var presignedUrl = await _minioClient.PresignedGetObjectAsync(getObjectArgs);
        return Result<string>.Success(presignedUrl);
    }

    public async Task<Result<FileMetadata>> GetFileMetadataAsync(string fileName, string folderName)
    {
        var filePath = Path.Combine(folderName, fileName);
        var statObjectArgs = new StatObjectArgs().WithBucket(BucketName).WithObject(filePath);
        var statObjectResponse = await _minioClient.StatObjectAsync(statObjectArgs);
        if (statObjectArgs is null)
        {
            return Result<FileMetadata>.Failure("File not found");
        }
        var fileMetadata = new FileMetadata
        {
            FileName = statObjectResponse.ObjectName,
            ContentType = statObjectResponse.ContentType,
            Size = statObjectResponse.Size,
            LastModified = statObjectResponse.LastModified,
            MetaData = statObjectResponse.MetaData,
        };
        return Result<FileMetadata>.Success(fileMetadata);
    }

    public async Task<Result> UploadAsync(IFormFile file, string folderName)
    {
        try
        {
            var bucketExists = await _minioClient.BucketExistsAsync(
                new BucketExistsArgs().WithBucket(BucketName)
            );
            if (!bucketExists)
            {
                await _minioClient.MakeBucketAsync(new MakeBucketArgs().WithBucket(BucketName));
            }

            // Upload file
            await using var stream = file.OpenReadStream();
            var putObjectArgs = new PutObjectArgs()
                .WithBucket(BucketName)
                .WithStreamData(stream)
                .WithObject(file.FileName)
                .WithObjectSize(file.Length)
                .WithContentType(file.ContentType);
            await _minioClient.PutObjectAsync(putObjectArgs).ConfigureAwait(false);
        }
        catch (MinioException e)
        {
            return Result.Failure(e.Message);
        }
        return Result.Success();
    }

    public async Task<Result> DeleteAsync(string fileName, string folderName)
    {
        var filePath = Path.Combine(folderName, fileName);
        var removeObjectArgs = new RemoveObjectArgs().WithBucket(BucketName).WithObject(filePath);
        await _minioClient.RemoveObjectAsync(removeObjectArgs);
        return Result.Success();
    }
}

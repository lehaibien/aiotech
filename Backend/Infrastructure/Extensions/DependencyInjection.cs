using Application.Abstractions;
using Application.Files;
using Application.Images;
using Application.Mail;
using Domain.UnitOfWork;
using Infrastructure.Caching;
using Infrastructure.Mail;
using Infrastructure.Persistent;
using Infrastructure.Persistent.Interceptors;
using Infrastructure.Storage;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Minio;
using StackExchange.Redis;

namespace Infrastructure.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        var connectionString = Environment.GetEnvironmentVariable(
            "ConnectionStrings__DefaultConnection"
        );
        if (string.IsNullOrWhiteSpace(connectionString))
        {
            connectionString = configuration.GetConnectionString("DatabaseConnection");
        }

        services.AddSingleton<AuditInterceptor>();

        services.AddDbContext<ApplicationDbContext>(
            (sp, options) =>
            {
                options
                    .UseSqlServer(
                        connectionString,
                        cfg =>
                        {
                            cfg.CommandTimeout(180);
                            cfg.EnableRetryOnFailure(10, TimeSpan.FromSeconds(30), null);
                        }
                    )
                    .AddInterceptors(sp.GetRequiredService<AuditInterceptor>())
                    .LogTo(Console.WriteLine);
            }
        );
        services.AddStackExchangeRedisCache(options =>
        {
            options.Configuration =
                Environment.GetEnvironmentVariable("ConnectionStrings__Redis")
                ?? configuration.GetConnectionString("RedisConnection");
            options.ConfigurationOptions = new ConfigurationOptions
            {
                AbortOnConnectFail = true,
                EndPoints = { options.Configuration },
            };
        });
        services.AddInfraMinio();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IFileService, FileService>();
        services.AddScoped<IImageService, ImageService>();
        services.AddScoped<IStorageService, StorageService>();
        services.AddScoped<ICacheService, CacheService>();
        return services;
    }

    private static IServiceCollection AddInfraMinio(this IServiceCollection services)
    {
        var url =
            Environment.GetEnvironmentVariable("ConnectionStrings__Minio") ?? "localhost:9000";
        var accessKey = Environment.GetEnvironmentVariable("MINIO_ROOT_USER");
        var secretKey = Environment.GetEnvironmentVariable("MINIO_ROOT_PASSWORD");
        services.AddMinio(
            (config) =>
                config
                    .WithEndpoint(url)
                    .WithCredentials(accessKey, secretKey)
                    .WithSSL(false)
                    .Build()
        );

        return services;
    }
}

using Application.Files;
using Application.Images;
using Application.Mail;
using Domain.UnitOfWork;
using Infrastructure.Files;
using Infrastructure.Mail;
using Infrastructure.Persistent;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

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
            connectionString = configuration.GetConnectionString("Docker");
        }

        services.AddDbContext<ApplicationDbContext>(options =>
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
                .LogTo(Console.WriteLine);
        });
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddScoped<IFileService, FileService>();
        services.AddScoped<IImageService, ImageService>();
        return services;
    }
}

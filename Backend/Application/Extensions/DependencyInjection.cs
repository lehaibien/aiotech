using System.Reflection;
using Application.Helpers;
using Application.Jwt.Options;
using Application.Options;
using Application.SeedData;
using Application.Users;
using AutoMapper;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Application.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services
            .Configure<JwtOption>(configuration.GetSection("Jwt"))
            .Configure<MailSettingsOption>(configuration.GetSection("MailSettings"))
            .Configure<MomoOption>(configuration.GetSection("Momo"))
            .Configure<VnPayOption>(configuration.GetSection("VnPay"));

        services.AddHttpClient<MomoLibrary>();

        services.AddScoped<MomoLibrary>();
        var assembly = Assembly.GetAssembly(typeof(UserProfile));
        var mapperConfig = new MapperConfiguration(cfg => cfg.AddMaps(assembly));
        var mapper = mapperConfig.CreateMapper();
        services.AddSingleton(mapper);
        // SEED DATA, SHOULD BE REMOVED IN PRODUCTION
        // WARN: This is for development only
        services.AddScoped<SeedDataService>();
        return services;
    }
}

using System.Reflection;
using Application.SeedData;
using Application.Users;
using AutoMapper;
using Microsoft.Extensions.DependencyInjection;

namespace Application.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection AddApplication(this IServiceCollection services)
    {
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

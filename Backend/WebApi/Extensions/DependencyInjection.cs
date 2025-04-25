using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Cors;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using Serilog.Exceptions;
using Shared;
using StackExchange.Redis;
using WebApi.ExceptionHandler;

namespace WebApi.Extensions;

public static class DependencyInjection
{
    public static IServiceCollection ConfigureExceptionHandler(this IServiceCollection services)
    {
        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddProblemDetails();
        return services;
    }

    /*************  ✨ Windsurf Command ⭐  *************/
    /// <summary>
    /// Configures CORS (Cross-Origin Resource Sharing) for the application.
    /// </summary>
    /// <param name="services">The IServiceCollection to add services to.</param>
    /// <param name="configuration">The application configuration settings.</param>
    /// <returns>The updated IServiceCollection.</returns>
    /// <remarks>
    /// This method sets up a CORS policy that allows any method, any header,
    /// and credentials, while allowing any origin.
    /// </remarks>

    /*******  6a1cdf82-875f-485b-b651-e1f2a80a0ac4  *******/
    public static IServiceCollection ConfigureCors(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        var cors = new EnableCorsAttribute(CommonConst.CorsPolicy);
        services.AddCors(options =>
        {
            options.AddPolicy(
                cors.PolicyName!,
                policy =>
                    policy
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .SetIsOriginAllowed(_ => true)
            );
        });
        return services;
    }

    public static IServiceCollection ConfigureAuthentication(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services
            .AddAuthentication(options =>
            {
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.ASCII.GetBytes(configuration["Jwt:Key"])
                    ),
                    ValidateLifetime = true,
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidIssuer = configuration["Jwt:Issuer"],
                    ValidAudience = configuration["Jwt:Audience"],
                };
            });
        return services;
    }

    public static IServiceCollection ConfigureAuthorization(this IServiceCollection services)
    {
        services
            .AddAuthorizationBuilder()
            .AddPolicy("Admin", policy => policy.RequireRole(RolePolicy.Admin))
            .AddPolicy("Shipper", policy => policy.RequireRole(RolePolicy.Shipper))
            .AddPolicy("AdminOrShipper", policy => policy.RequireRole(RolePolicy.AdminOrShipper));
        return services;
    }

    public static ILoggingBuilder ConfigureLogger(
        this ILoggingBuilder loggingBuilder,
        IConfiguration configuration
    )
    {
        var logger = new LoggerConfiguration()
            .ReadFrom.Configuration(configuration)
            .Enrich.WithCorrelationId()
            .Enrich.FromLogContext()
            .Enrich.WithMachineName()
            .Enrich.WithExceptionDetails()
            .CreateLogger();

        loggingBuilder.ClearProviders();
        loggingBuilder.AddSerilog(logger);
        return loggingBuilder;
    }
}

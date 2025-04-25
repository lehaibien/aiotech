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
    /// <summary>
    /// Registers a global exception handler and adds problem details support to the service collection.
    /// </summary>
    /// <returns>The updated <see cref="IServiceCollection"/>.</returns>
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

    /// <summary>
    /// Configures a CORS policy that allows any origin, method, header, and credentials.
    /// </summary>
    /// <returns>The updated service collection with the CORS policy applied.</returns>
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

    /// <summary>
    /// Configures JWT Bearer authentication using settings from the application configuration.
    /// </summary>
    /// <param name="configuration">Application configuration containing JWT settings such as key, issuer, and audience.</param>
    /// <returns>The updated service collection with authentication configured.</returns>
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

    /// <summary>
    /// Adds authorization policies for "Admin", "Shipper", and "AdminOrShipper" roles to the service collection.
    /// </summary>
    /// <returns>The updated <see cref="IServiceCollection"/> with configured authorization policies.</returns>
    public static IServiceCollection ConfigureAuthorization(this IServiceCollection services)
    {
        services
            .AddAuthorizationBuilder()
            .AddPolicy("Admin", policy => policy.RequireRole(RolePolicy.Admin))
            .AddPolicy("Shipper", policy => policy.RequireRole(RolePolicy.Shipper))
            .AddPolicy("AdminOrShipper", policy => policy.RequireRole(RolePolicy.AdminOrShipper));
        return services;
    }

    /// <summary>
    /// Configures Serilog as the logging provider using settings from the specified configuration, enriching logs with correlation ID, log context, machine name, and exception details.
    /// </summary>
    /// <param name="loggingBuilder">The logging builder to configure.</param>
    /// <param name="configuration">The application configuration containing Serilog settings.</param>
    /// <returns>The updated logging builder with Serilog configured.</returns>
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

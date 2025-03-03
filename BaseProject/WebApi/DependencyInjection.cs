using System.Text;
using Application.Jwt.Options;
using Application.Options;
using AutoDependencyRegistration;
using Infrastructure.Persistent;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Cors;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebApi.ExceptionHandler;

namespace WebApi;

public static class DependencyInjection
{
    public static IServiceCollection AddDefaultConfig(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddSingleton(configuration);
        services.AddHttpContextAccessor();
        services.ConfigureExceptionHandler();
        services.ConfigureAuthentication(configuration).ConfigureAuthorization();
        services.ConfigureCors(configuration);
        services.AutoRegisterDependencies();
        //CONFIGURATION
        services
            .Configure<JwtOption>(configuration.GetSection("Jwt"))
            .Configure<VnPayOption>(configuration.GetSection("VnPay"))
            .Configure<MailSettingsOption>(configuration.GetSection("MailSettings"));
        return services;
    }

    private static IServiceCollection ConfigureExceptionHandler(this IServiceCollection services)
    {
        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddProblemDetails();
        return services;
    }

    private static IServiceCollection ConfigureCors(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        var cors = new EnableCorsAttribute("AllowAll");
        services.AddCors(options =>
        {
            options.AddPolicy(
                cors.PolicyName!,
                policy =>
                {
                    // .WithOrigins(configuration["Cors:Origins"]?.Split(",") ?? ["*"])
                    // .WithHeaders(configuration["Cors:Headers"]?.Split(",") ?? ["*"])
                    // .WithMethods(configuration["Cors:Methods"]?.Split(",") ?? ["*"])
                    policy
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials()
                        .SetIsOriginAllowed(_ => true);
                }
            );
        });
        return services;
    }

    private static IServiceCollection ConfigureAuthentication(
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

    private static IServiceCollection ConfigureAuthorization(this IServiceCollection services)
    {
        services
            .AddAuthorizationBuilder()
            .AddPolicy("Admin", policy => policy.RequireRole("Admin"))
            .AddPolicy("Manager", policy => policy.RequireRole("Manager"))
            .AddPolicy("AdminOrManager", policy => policy.RequireRole("Admin", "Manager"));
        // services.AddAuthorization(options =>
        // {
        //     options.AddPolicy("AdminAndManager", policy => policy.RequireRole("Admin", "Manager"));
        //     options.AddPolicy("Admin", policy => policy.RequireRole("Admin"));
        //     options.AddPolicy("Manager", policy => policy.RequireRole("Manager"));
        // });
        return services;
    }

    public static WebApplication AddMigration(this WebApplication app)
    {
        if (!app.Environment.IsDevelopment())
            return app;
        var scope = app.Services.CreateScope();
        var context = scope.ServiceProvider.GetService<ApplicationDbContext>();
        if (context is not null && context.Database.GetPendingMigrations().Any())
        {
            context?.Database.Migrate();
        }

        return app;
    }
}

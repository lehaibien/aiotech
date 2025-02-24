using System.Reflection;
using System.Text;
using Application.Jwt.Options;
using Application.Mail;
using Application.Notification;
using Application.Options;
using Application.SeedData;
using Application.Users;
using AutoDependencyRegistration;
using AutoMapper;
using Domain.UnitOfWork;
using Infrastructure.Mail;
using Infrastructure.Persistent;
using Infrastructure.UnitOfWork;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.Google;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Cors;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using WebApi.ExceptionHandler;

namespace WebApi;

public static class DependencyInjection
{
    public static IServiceCollection ConfigureServices(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddSingleton(configuration);
        services.AddHttpContextAccessor();
        services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
        services.ConfigureExceptionHandler();
        services.ConfigureAuthentication(configuration);
        services.ConfigureAuthorization();
        services.ConfigureCors(configuration);
        services.ConfigureDatabase(configuration);
        services.ConfigureMapper();
        services.AutoRegisterDependencies();
        //CONFIGURATION
        services.Configure<JwtOption>(configuration.GetSection("Jwt"));
        services.Configure<VnPayOption>(configuration.GetSection("VnPay"));
        services.Configure<MailSettingsOption>(configuration.GetSection("MailSettings"));
        // SEED DATA, SHOULD BE REMOVED IN PRODUCTION
        // WARN: This is for development only
        services.AddScoped<SeedDataService>();
        services.AddScoped<IEmailService, EmailService>();
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
                        .SetIsOriginAllowed(hostName => true);
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
        services.AddAuthorization(options =>
        {
            options.AddPolicy(
                "AdminAndManager",
                policy =>
                {
                    policy.RequireRole("Admin", "Manager");
                }
            );
            options.AddPolicy(
                "Admin",
                policy =>
                {
                    policy.RequireRole("Admin");
                }
            );
            options.AddPolicy(
                "Manager",
                policy =>
                {
                    policy.RequireRole("Manager");
                }
            );
        });
        return services;
    }

    private static IServiceCollection ConfigureDatabase(
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
            options.UseSqlServer(
                connectionString,
                cfg =>
                {
                    cfg.CommandTimeout(180);
                    cfg.EnableRetryOnFailure(10, TimeSpan.FromSeconds(30), null);
                }
            );
        });
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        return services;
    }

    private static IServiceCollection ConfigureMapper(this IServiceCollection services)
    {
        // Get application assembly
        var assembly = Assembly.GetAssembly(typeof(UserProfile));
        var mapperConfig = new MapperConfiguration(cfg => cfg.AddMaps(assembly));
        var mapper = mapperConfig.CreateMapper();
        services.AddSingleton(mapper);
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

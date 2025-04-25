using System.Reflection;
using Application.Authentication;
using Application.Brands;
using Application.Carts;
using Application.Categories;
using Application.Configurations;
using Application.Dashboard;
using Application.Discounts;
using Application.Helpers;
using Application.Images;
using Application.Jwt;
using Application.Jwt.Options;
using Application.Options;
using Application.Orders;
using Application.Posts;
using Application.Products;
using Application.Reports;
using Application.Reviews;
using Application.Roles;
using Application.Users;
using Application.Wishlist;
using AutoMapper;
using FluentValidation;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Application.Extensions;

public static class DependencyInjection
{
    /// <summary>
    /// Registers application options, services, AutoMapper profiles, HTTP clients, and validators with the service collection.
    /// </summary>
    /// <param name="configuration">The application configuration used for binding options.</param>
    /// <returns>The updated service collection with all application dependencies registered.</returns>
    public static IServiceCollection AddApplication(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.AddApplicationOptions(configuration);
        services.AddHttpClient<MomoLibrary>();
        services.AddApplicationAutoMapper();
        services.AddApplicationServices();
        services.AddValidators();
        return services;
    }

    /// <summary>
    /// Binds configuration sections to strongly typed application option classes for dependency injection.
    /// </summary>
    /// <param name="configuration">The application's configuration source.</param>
    /// <returns>The updated service collection.</returns>
    private static IServiceCollection AddApplicationOptions(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services.Configure<JwtOption>(configuration.GetSection("Jwt"));
        services.Configure<MailSettingsOption>(configuration.GetSection("MailSettings"));
        services.Configure<MomoOption>(configuration.GetSection("Momo"));
        services.Configure<VnPayOption>(configuration.GetSection("VnPay"));
        return services;
    }

    /// <summary>
    /// Registers AutoMapper with profiles from the assembly containing <c>RoleProfile</c> as a singleton service.
    /// </summary>
    /// <returns>The updated <see cref="IServiceCollection"/>.</returns>
    private static IServiceCollection AddApplicationAutoMapper(this IServiceCollection services)
    {
        var assembly = Assembly.GetAssembly(typeof(RoleProfile));
        var mapperConfig = new MapperConfiguration(cfg => cfg.AddMaps(assembly));
        var mapper = mapperConfig.CreateMapper();
        services.AddSingleton(mapper);
        return services;
    }

    /// <summary>
    /// Registers application service interfaces and their implementations with appropriate lifetimes in the dependency injection container.
    /// </summary>
    /// <returns>The updated <see cref="IServiceCollection"/> with application services registered.</returns>
    private static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddSingleton<IJwtService, JwtService>();
        services.AddSingleton<MomoLibrary>();
        services.AddScoped<IImageService, ImageService>();
        services.AddScoped<IAuthenticationService, AuthenticationService>();
        services.AddScoped<IBrandService, BrandService>();
        services.AddScoped<ICartService, CartService>();
        services.AddScoped<ICategoryService, CategoryService>();
        services.AddScoped<IConfigurationService, ConfigurationService>();
        services.AddScoped<IDashboardService, DashboardService>();
        services.AddScoped<IDiscountService, DiscountService>();
        services.AddScoped<IOrderService, OrderService>();
        services.AddScoped<IPostService, PostService>();
        services.AddScoped<IProductService, ProductService>();
        services.AddScoped<IReportService, ReportService>();
        services.AddScoped<IReviewService, ReviewService>();
        services.AddScoped<IRoleService, RoleService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<IWishlistService, WishlistService>();
        return services;
    }

    /// <summary>
    /// Registers all FluentValidation validators from the executing assembly.
    /// </summary>
    /// <returns>The updated service collection.</returns>
    private static IServiceCollection AddValidators(this IServiceCollection services)
    {
        services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
        return services;
    }
}

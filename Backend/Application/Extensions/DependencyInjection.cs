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
        services.AddApplicationOptions(configuration);
        services.AddHttpClient<MomoLibrary>();
        services.AddApplicationAutoMapper();
        services.AddApplicationServices();
        return services;
    }

    public static IServiceCollection AddApplicationOptions(
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

    public static IServiceCollection AddApplicationAutoMapper(this IServiceCollection services)
    {
        var assembly = Assembly.GetAssembly(typeof(RoleProfile));
        var mapperConfig = new MapperConfiguration(cfg => cfg.AddMaps(assembly));
        var mapper = mapperConfig.CreateMapper();
        services.AddSingleton(mapper);
        return services;
    }

    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddSingleton<IJwtService, JwtService>();
        services.AddSingleton<MomoLibrary>();
        services.AddScoped<IStorageImageService, StorageImageService>();
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
}

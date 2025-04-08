using Application.Configurations.Dtos;
using AutoDependencyRegistration.Attributes;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using Shared;

namespace Application.Configurations;

[RegisterClassAsScoped]
public class ConfigurationService : IConfigurationService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IDistributedCache _cache;

    public ConfigurationService(IUnitOfWork unitOfWork, IDistributedCache cache)
    {
        _unitOfWork = unitOfWork;
        _cache = cache;
    }

    public async Task<Result<BannerConfiguration>> GetBannerConfiguration()
    {
        var cacheData = _cache.GetString("bannerConfig");
        if (cacheData is not null) {
            var data = JsonConvert.DeserializeObject<BannerConfiguration>(cacheData);
            return Result<BannerConfiguration>.Success(data);
        }
        var config = await _unitOfWork
            .GetRepository<Configuration>()
            .GetAll()
            .FirstOrDefaultAsync(c => c.Key == "banner");
        if (config is null)
        {
            return Result<BannerConfiguration>.Failure("Không tìm thấy cấu hình banner");
        }
        var bannerConfig = JsonConvert.DeserializeObject<BannerConfiguration>(config.Value);
        return Result<BannerConfiguration>.Success(bannerConfig);
    }

    public async Task<Result<BannerConfiguration>> SetBannerConfiguration(
        BannerConfiguration bannerConfiguration
    )
    {
        var config = await _unitOfWork
            .GetRepository<Configuration>()
            .GetAll()
            .FirstOrDefaultAsync(c => c.Key == "banner");
        if (config is null)
        {
            config = new Configuration
            {
                Key = "banner",
                Value = JsonConvert.SerializeObject(bannerConfiguration),
            };
            _unitOfWork.GetRepository<Configuration>().Add(config);
        }
        else
        {
            config.Value = JsonConvert.SerializeObject(bannerConfiguration);
            _unitOfWork.GetRepository<Configuration>().Update(config);
        }
        await _unitOfWork.SaveChangesAsync();
        _cache.SetString("bannerConfig", JsonConvert.SerializeObject(bannerConfiguration));
        var data = JsonConvert.DeserializeObject<BannerConfiguration>(config.Value);
        return Result<BannerConfiguration>.Success(data);
    }

    public async Task<Result<EmailConfiguration>> GetEmailConfiguration()
    {
        var cacheData = _cache.GetString("emailConfig");
        if (cacheData is not null) {
            var data = JsonConvert.DeserializeObject<EmailConfiguration>(cacheData);
            return Result<EmailConfiguration>.Success(data);
        }
        var config = await _unitOfWork
            .GetRepository<Configuration>()
            .GetAll()
            .FirstOrDefaultAsync(c => c.Key == "email");
        if (config is null)
        {
            return Result<EmailConfiguration>.Failure("Không tìm thấy cấu hình email");
        }
        var emailConfig = JsonConvert.DeserializeObject<EmailConfiguration>(config.Value);
        return Result<EmailConfiguration>.Success(emailConfig);
    }

    public async Task<Result<EmailConfiguration>> SetEmailConfiguration(
        EmailConfiguration emailConfiguration
    )
    {
        var config = await _unitOfWork
            .GetRepository<Configuration>()
            .GetAll()
            .FirstOrDefaultAsync(c => c.Key == "email");
        if (config is null)
        {
            config = new Configuration
            {
                Key = "email",
                Value = JsonConvert.SerializeObject(emailConfiguration),
            };
            _unitOfWork.GetRepository<Configuration>().Add(config);
        }
        else
        {
            config.Value = JsonConvert.SerializeObject(emailConfiguration);
            _unitOfWork.GetRepository<Configuration>().Update(config);
        }
        await _unitOfWork.SaveChangesAsync();
        _cache.SetString("emailConfig", JsonConvert.SerializeObject(emailConfiguration));
        var data = JsonConvert.DeserializeObject<EmailConfiguration>(config.Value);
        return Result<EmailConfiguration>.Success(data);
    }
}

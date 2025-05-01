using Application.Abstractions;
using Application.Configurations.Dtos;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using Application.Shared;

namespace Application.Configurations;

public class ConfigurationService : IConfigurationService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICacheService _cacheService;

    public ConfigurationService(IUnitOfWork unitOfWork, ICacheService cacheService)
    {
        _unitOfWork = unitOfWork;
        _cacheService = cacheService;
    }

    public async Task<Result<BannerConfiguration>> GetBannerConfigurationAsync(CancellationToken cancellationToken = default)
    {
        var cacheData = await _cacheService.GetAsync<BannerConfiguration>(CacheKeys.BannerConfiguration);
        if (cacheData is not null) {
            return Result<BannerConfiguration>.Success(cacheData);
        }
        var config = await _unitOfWork
            .GetRepository<Configuration>()
            .GetAll(c => c.Key == "banner")
            .FirstOrDefaultAsync(cancellationToken);
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
            .GetAll(c => c.Key == "banner")
            .FirstOrDefaultAsync();
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
        await _cacheService.SetAsync(CacheKeys.BannerConfiguration, config);
        var data = JsonConvert.DeserializeObject<BannerConfiguration>(config.Value);
        return Result<BannerConfiguration>.Success(data);
    }

    public async Task<Result<EmailConfiguration>> GetEmailConfiguration(CancellationToken cancellationToken = default)
    {
        var cacheData = await _cacheService.GetAsync<EmailConfiguration>(CacheKeys.EmailConfiguration);
        if (cacheData is not null) {
            return Result<EmailConfiguration>.Success(cacheData);
        }
        var config = await _unitOfWork
            .GetRepository<Configuration>()
            .GetAll(c => c.Key == "email")
            .FirstOrDefaultAsync(cancellationToken);
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
            .GetAll(c => c.Key == "email")
            .FirstOrDefaultAsync();
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
        await _cacheService.SetAsync(CacheKeys.EmailConfiguration, config);
        var data = JsonConvert.DeserializeObject<EmailConfiguration>(config.Value);
        return Result<EmailConfiguration>.Success(data);
    }
}

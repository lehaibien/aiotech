using Application.Configurations.Dtos;
using Shared;

namespace Application.Configurations;

public interface IConfigurationService
{
    Task<Result<BannerConfiguration>> GetBannerConfiguration();
    Task<Result<BannerConfiguration>> SetBannerConfiguration(
        BannerConfiguration bannerConfiguration
    );
    Task<Result<EmailConfiguration>> GetEmailConfiguration();
    Task<Result<EmailConfiguration>> SetEmailConfiguration(EmailConfiguration emailConfiguration);
}

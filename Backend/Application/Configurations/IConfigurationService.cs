using Application.Configurations.Dtos;
using Application.Shared;

namespace Application.Configurations;

public interface IConfigurationService
{
    Task<Result<BannerConfiguration>> GetBannerConfigurationAsync(CancellationToken cancellationToken = default);
    Task<Result<EmailConfiguration>> GetEmailConfiguration(CancellationToken cancellationToken = default);
    Task<Result<BannerConfiguration>> SetBannerConfiguration(
        BannerConfiguration bannerConfiguration
    );
    Task<Result<EmailConfiguration>> SetEmailConfiguration(EmailConfiguration emailConfiguration);
}

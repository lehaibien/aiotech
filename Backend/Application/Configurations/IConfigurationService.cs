using Application.Configurations.Dtos;
using Application.Shared;

namespace Application.Configurations;

public interface IConfigurationService
{
    Task<Result<BannerConfiguration>> GetBannerConfigurationAsync(
        CancellationToken cancellationToken = default
    );
    Task<Result<EmailConfiguration>> GetEmailConfigurationAsync(
        CancellationToken cancellationToken = default
    );
    Task<Result<BannerConfiguration>> SetBannerConfigurationAsync(
        BannerConfiguration bannerConfiguration
    );
    Task<Result<EmailConfiguration>> SetEmailConfigurationAsync(
        EmailConfiguration emailConfiguration
    );
}

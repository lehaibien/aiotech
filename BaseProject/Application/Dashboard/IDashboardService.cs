using Application.Dashboard.Dtos;
using Shared;

namespace Application.Dashboard;

public interface IDashboardService
{
    Task<Result<DashboardCard>> GetDashboardCardAsync();
}

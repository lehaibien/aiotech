using Application.Dashboard.Dtos;
using Shared;

namespace Application.Dashboard;

public interface IDashboardService
{
    Task<Result<DashboardCard>> GetDashboardCardAsync();
    Task<Result<List<DashboardSale>>> GetDashboardSaleAsync();
    Task<Result<List<DashboardTopProduct>>> GetDashboardTopProductAsync();
    Task<Result<List<DashboardStockAlert>>> GetDashboardStockAlertAsync(int stockThreshold = 10);
}

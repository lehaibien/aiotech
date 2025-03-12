using Application.Dashboard.Dtos;
using AutoDependencyRegistration.Attributes;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Application.Dashboard;

[RegisterClassAsScoped]
public class DashboardService : IDashboardService
{
    private readonly IUnitOfWork _unitOfWork;

    public DashboardService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<DashboardCard>> GetDashboardCardAsync()
    {
        var now = DateTime.UtcNow;
        var currentMonthStart = new DateTime(now.Year, now.Month, 1);
        var previousMonthStart = currentMonthStart.AddMonths(-1);
        var previousMonthEnd = previousMonthStart.AddMonths(1).AddDays(-1);
        var revenue = await _unitOfWork
            .GetRepository<Order>()
            .GetAll(o => o.Status == OrderStatus.Completed)
            .GroupBy(_ => 1)
            .Select(g => new
            {
                CurrentRevenue = g.Where(o =>
                        o.DeliveryDate >= currentMonthStart && o.DeliveryDate <= now
                    )
                    .Sum(o => (double?)o.TotalPrice) ?? 0,
                PreviousRevenue = g.Where(o =>
                        o.DeliveryDate >= previousMonthStart && o.DeliveryDate <= previousMonthEnd
                    )
                    .Sum(o => (double?)o.TotalPrice) ?? 0,
            })
            .Select(r => new RevenueCard
            {
                Revenue = r.CurrentRevenue,
                RevenueDiff =
                    r.PreviousRevenue == 0
                        ? (r.CurrentRevenue == 0 ? 0 : 100) // Adjust as needed
                        : ((r.CurrentRevenue - r.PreviousRevenue) / r.PreviousRevenue) * 100,
            })
            .FirstOrDefaultAsync();
        var order = await _unitOfWork
            .GetRepository<Order>()
            .GetAll()
            .Where(o => o.Status == OrderStatus.Completed)
            .GroupBy(_ => 1)
            .Select(x => new
            {
                CurrentCount = x.Count(o =>
                    o.DeliveryDate >= currentMonthStart && o.DeliveryDate <= now
                ),
                PreviousCount = x.Count(o =>
                    o.DeliveryDate >= previousMonthStart && o.DeliveryDate <= previousMonthEnd
                ),
            })
            .Select(x => new OrderCard
            {
                Order = x.CurrentCount,
                OrderDiff =
                    x.PreviousCount == 0
                        ? (x.CurrentCount == 0 ? 0 : 100) // Adjust as needed
                        : (x.CurrentCount - x.PreviousCount) / x.PreviousCount * 100,
            })
            .FirstOrDefaultAsync();
        var averageOrderValue = await _unitOfWork
            .GetRepository<Order>()
            .GetAll()
            .Where(o => o.Status == OrderStatus.Completed)
            .GroupBy(_ => 1)
            .Select(x => new
            {
                CurrentAverage = x.Where(o =>
                        o.DeliveryDate >= currentMonthStart && o.DeliveryDate <= now
                    )
                    .Average(o => (double?)o.TotalPrice) ?? 0,
                PreviousAverage = x.Where(o =>
                        o.DeliveryDate >= previousMonthStart && o.DeliveryDate <= previousMonthEnd
                    )
                    .Average(o => (double?)o.TotalPrice) ?? 0,
            })
            .Select(x => new AverageOrderValueCard
            {
                AverageOrderValue = x.CurrentAverage,
                AverageOrderValueDiff =
                    x.PreviousAverage == 0
                        ? (x.CurrentAverage == 0 ? 0 : 100)
                        : (x.CurrentAverage - x.PreviousAverage) / x.PreviousAverage * 100,
            })
            .FirstOrDefaultAsync();
        var newUser = await _unitOfWork
            .GetRepository<User>()
            .GetAll()
            .Where(u => u.CreatedDate >= currentMonthStart && u.CreatedDate <= now)
            .GroupBy(_ => 1)
            .Select(x => new
            {
                CurrentNewUser = x.Count(y =>
                    y.CreatedDate >= currentMonthStart && y.CreatedDate <= now
                ),
                PreviousNewUser = x.Count(y =>
                    y.CreatedDate >= previousMonthStart && y.CreatedDate <= previousMonthEnd
                ),
            })
            .Select(x => new NewUserCard
            {
                NewUser = x.CurrentNewUser,
                NewUserDiff =
                    x.PreviousNewUser == 0
                        ? (x.CurrentNewUser == 0 ? 0 : 100)
                        : (x.CurrentNewUser - x.PreviousNewUser) / x.PreviousNewUser * 100,
            })
            .FirstOrDefaultAsync();
        var result = new DashboardCard
        {
            Revenue = revenue?.Revenue ?? 0,
            RevenueDiff = revenue?.RevenueDiff ?? 0,
            Order = order?.Order ?? 0,
            OrderDiff = order?.OrderDiff ?? 0,
            AverageOrderValue = averageOrderValue?.AverageOrderValue ?? 0,
            AverageOrderValueDiff = averageOrderValue?.AverageOrderValueDiff ?? 0,
            NewUser = newUser?.NewUser ?? 0,
            NewUserDiff = newUser?.NewUserDiff ?? 0,
        };
        return Result<DashboardCard>.Success(result);
    }
}

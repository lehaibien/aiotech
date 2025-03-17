using Application.Dashboard.Dtos;
using AutoDependencyRegistration.Attributes;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.EntityFrameworkCore;
using Microsoft.VisualBasic;
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

    public async Task<Result<List<DashboardTopProduct>>> GetDashboardTopProductAsync()
    {
        var order = _unitOfWork.GetRepository<OrderItem>().GetAll();
        var result = await _unitOfWork
            .GetRepository<Product>()
            .GetAll(x =>
                order.Any(oi =>
                    oi.ProductId == x.Id
                    && !oi.Order.IsDeleted
                    && oi.Order.Status == OrderStatus.Completed
                )
            )
            .Select(x => new DashboardTopProduct
            {
                Id = x.Id,
                Name = x.Name,
                ImageUrls = x.ImageUrls,
                Sales = order.Count(oi => oi.ProductId == x.Id),
            })
            .OrderByDescending(p => order.Count(oi => oi.ProductId == p.Id))
            .Take(8)
            .ToListAsync();
        return Result<List<DashboardTopProduct>>.Success(result);
    }

    public async Task<Result<List<DashboardSale>>> GetDashboardSaleAsync()
    {
        var now = DateTime.UtcNow;
        var firstMonthStart = new DateTime(now.Year, 1, 1);
        var lastMonthEnd = new DateTime(now.Year, 12, 31);
        var orders = await _unitOfWork
            .GetRepository<Order>()
            .GetAll()
            .Where(o => o.CreatedDate >= firstMonthStart && o.CreatedDate <= lastMonthEnd)
            .ToListAsync();

        var allMonths = Enumerable.Range(0, 12).Select(i => firstMonthStart.AddMonths(i)).ToList();

        // Group orders by month
        var groupedOrders = orders
            .GroupBy(o => new DateTime(o.CreatedDate.Year, o.CreatedDate.Month, 1)) // Group by the first day of the month
            .ToDictionary(g => g.Key, g => g.ToList());

        // Build the report for each month
        var report = allMonths.ConvertAll(month =>
        {
            // Get orders for the current month, or an empty list if no orders exist
            var monthlyOrders = groupedOrders.TryGetValue(month, out List<Order>? value)
                ? value
                : [];

            // Calculate metrics
            var completedOrders = monthlyOrders
                .Where(o => o.Status == OrderStatus.Completed)
                .ToList();
            var totalRevenue = completedOrders.Sum(o => o.TotalPrice);
            var averageOrderValue =
                completedOrders.Count != 0 ? completedOrders.Average(o => o.TotalPrice) : 0;

            return new DashboardSale { Date = month, Revenue = totalRevenue };
        });

        return Result<List<DashboardSale>>.Success(report);
    }

    public async Task<Result<List<DashboardStockAlert>>> GetDashboardStockAlertAsync(
        int stockThreshold = 10
    )
    {
        var result = await _unitOfWork
            .GetRepository<Product>()
            .GetAll()
            .Where(p => p.Stock <= stockThreshold)
            .Select(p => new DashboardStockAlert
            {
                ProductId = p.Id,
                ProductName = p.Name,
                ProductImage = p.ImageUrls.FirstOrDefault()!,
                Stock = p.Stock,
            })
            .ToListAsync();
        return Result<List<DashboardStockAlert>>.Success(result);
    }
}

using Application.Dashboard.Dtos;
using Application.Shared;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.EntityFrameworkCore;

namespace Application.Dashboard;

public class DashboardService(IUnitOfWork unitOfWork) : IDashboardService
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;

    public async Task<Result<DashboardCard>> GetDashboardCardAsync()
    {
        var now = DateTime.UtcNow;
        var currentMonthStart = new DateTime(now.Year, now.Month, 1);
        var previousMonthStart = currentMonthStart.AddMonths(-1);
        var previousMonthEnd = previousMonthStart.AddMonths(1).AddDays(-1);
        RevenueCard? revenue = await _unitOfWork
            .GetRepository<Order>()
            .GetAll(o => o.Status == OrderStatus.Completed)
            .GroupBy(_ => 1)
            .Select(g => new
            {
                CurrentRevenue = g.Where(o =>
                        o.DeliveryDate >= currentMonthStart && o.DeliveryDate <= now
                    )
                    .Sum(o => o.TotalPrice),
                PreviousRevenue = g.Where(o =>
                        o.DeliveryDate >= previousMonthStart && o.DeliveryDate <= previousMonthEnd
                    )
                    .Sum(o => o.TotalPrice),
            })
            .Select(r => new RevenueCard
            {
                Revenue = r.CurrentRevenue,
                RevenueDiff = (double?)(
                    r.PreviousRevenue == 0
                        ? (r.CurrentRevenue == 0 ? 0 : 100)
                        : (r.CurrentRevenue - r.PreviousRevenue) / r.PreviousRevenue * 100
                ),
            })
            .OrderByDescending(r => r.Revenue)
            .FirstOrDefaultAsync();
        OrderCard? order =
            await _unitOfWork
                .GetRepository<Order>()
                .GetAll(o => o.Status == OrderStatus.Completed)
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
                            ? (x.CurrentCount == 0 ? 0 : 100)
                            : (x.CurrentCount - x.PreviousCount) * 100 / x.PreviousCount,
                })
                .OrderByDescending(r => r.Order)
                .FirstOrDefaultAsync() ?? new OrderCard { Order = 0, OrderDiff = 0 };

        AverageOrderValueCard? averageOrderValue =
            await _unitOfWork
                .GetRepository<Order>()
                .GetAll(o => o.Status == OrderStatus.Completed)
                .GroupBy(_ => 1)
                .Select(x => new
                {
                    CurrentAverage = x.Where(o =>
                            o.DeliveryDate >= currentMonthStart && o.DeliveryDate <= now
                        )
                        .Average(o => o.TotalPrice),
                    PreviousAverage = x.Where(o =>
                            o.DeliveryDate >= previousMonthStart
                            && o.DeliveryDate <= previousMonthEnd
                        )
                        .Average(o => o.TotalPrice),
                })
                .Select(x => new AverageOrderValueCard
                {
                    AverageOrderValue = x.CurrentAverage,
                    AverageOrderValueDiff = (double?)(
                        x.PreviousAverage == null || x.PreviousAverage == 0
                            ? (x.CurrentAverage == null || x.CurrentAverage == 0 ? 0 : 100)
                            : (x.CurrentAverage - x.PreviousAverage) * 100 / x.PreviousAverage
                    ),
                })
                .OrderByDescending(r => r.AverageOrderValue)
                .FirstOrDefaultAsync()
            ?? new AverageOrderValueCard { AverageOrderValue = 0, AverageOrderValueDiff = 0 };
        NewUserCard? newUser = await _unitOfWork
            .GetRepository<User>()
            .GetAll(u => u.CreatedDate >= currentMonthStart && u.CreatedDate <= now)
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
            .OrderByDescending(r => r.NewUser)
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
        IQueryable<OrderItem> order = _unitOfWork
            .GetRepository<OrderItem>()
            .GetAll(oi =>
                oi.Order != null && oi.Order.Status == OrderStatus.Completed && !oi.Order.IsDeleted
            );
        List<DashboardTopProduct> result = await _unitOfWork
            .GetRepository<Product>()
            .GetAll(x => order.Any(oi => oi.ProductId == x.Id))
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
        DateTime now = DateTime.UtcNow;
        DateTime firstMonthStart = new(now.Year, 1, 1);
        DateTime lastMonthEnd = new(now.Year, 12, 31);
        List<Order> orders = await _unitOfWork
            .GetRepository<Order>()
            .GetAll(o => o.CreatedDate >= firstMonthStart && o.CreatedDate <= lastMonthEnd)
            .ToListAsync();

        List<DateTime> allMonths = Enumerable
            .Range(0, 12)
            .Select(firstMonthStart.AddMonths)
            .ToList();

        Dictionary<DateTime, List<Order>> groupedOrders = orders
            .GroupBy(o => new DateTime(o.CreatedDate.Year, o.CreatedDate.Month, 1)) // Group by the first day of the month
            .ToDictionary(g => g.Key, g => g.ToList());

        List<DashboardSale> report = allMonths.ConvertAll(month =>
        {
            List<Order> monthlyOrders = groupedOrders.TryGetValue(month, out List<Order>? value)
                ? value
                : [];

            List<Order> completedOrders = monthlyOrders
                .Where(o => o.Status == OrderStatus.Completed)
                .ToList();
            decimal totalRevenue = completedOrders.Sum(o => o.TotalPrice);
            decimal averageOrderValue =
                completedOrders.Count != 0 ? completedOrders.Average(o => o.TotalPrice) : 0;

            return new DashboardSale { Date = month, Revenue = totalRevenue };
        });

        return Result<List<DashboardSale>>.Success(report);
    }

    public async Task<Result<List<DashboardStockAlert>>> GetDashboardStockAlertAsync(
        int stockThreshold = 5
    )
    {
        List<DashboardStockAlert> result = await _unitOfWork
            .GetRepository<Product>()
            .GetAll(p => p.Stock <= stockThreshold)
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

using System.Data;
using Application.Reports.Dtos;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Application.Reports;

public class ReportService : IReportService
{
    private readonly IUnitOfWork _unitOfWork;

    public ReportService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<List<SaleReportResponse>>> GetSaleReportsAsync(
        SaleReportRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var orders = await _unitOfWork
            .GetRepository<Order>()
            .GetAll(o =>
                o.CreatedDate >= request.StartDate
                && o.CreatedDate <= request.EndDate
                && o.IsDeleted == false
            )
            .ToListAsync(cancellationToken);

        var allMonths = new List<DateTime>();
        for (var month = request.StartDate; month <= request.EndDate; month = month.AddMonths(1))
        {
            allMonths.Add(new DateTime(month.Year, month.Month, 1));
        }

        // Group orders by month
        var groupedOrders = orders
            .GroupBy(o => new DateTime(o.CreatedDate.Year, o.CreatedDate.Month, 1))
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

            return new SaleReportResponse
            {
                Date = month,
                Revenue = totalRevenue,
                TotalOrder = monthlyOrders.Count,
                CompletedOrder = completedOrders.Count(o => o.Status == OrderStatus.Completed),
                CancelledOrder = monthlyOrders.Count(o => o.Status == OrderStatus.Cancelled),
                AverageOrderValue = averageOrderValue,
            };
        });

        return Result<List<SaleReportResponse>>.Success(report);
    }

    public async Task<Result<List<OrderReportResponse>>> GetOrderReportsAsync(
        OrderReportRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var parameters = new SqlParameter[]
        {
            new("@iStartDate", request.StartDate),
            new("@iEndDate", request.EndDate),
            new(
                "@iCustomerUsername",
                request.CustomerUsername is null ? DBNull.Value : request.CustomerUsername
            ),
        };
        var reports = await _unitOfWork
            .GetRepository<OrderReportResponse>()
            .ExecuteStoredProcedureAsync(StoredProcedure.GetOrderReport, parameters);

        return Result<List<OrderReportResponse>>.Success(reports.ToList());
    }

    public async Task<Result<PaginatedList>> GetOutOfStockReportAsync(
        InventoryStatusReportRequest request
    )
    {
        const int lowStockThreshold = 5;
        var query = _unitOfWork
            .GetRepository<Product>()
            .GetAll()
            .Where(x =>
                (request.BrandId == null || x.BrandId == request.BrandId)
                && (request.CategoryId == null || x.CategoryId == request.CategoryId)
            );
        var count = await query.CountAsync();
        var result = await query
            .Select(p => new InventoryStatusReportResponse
            {
                Id = p.Id,
                Sku = p.Sku,
                Name = p.Name,
                CurrentStock = p.Stock,
                StockStatus =
                    p.Stock <= 0 ? "Out of Stock"
                    : p.Stock <= lowStockThreshold ? "Low Stock"
                    : "In Stock",
                ReorderRecommended = p.Stock <= lowStockThreshold,
                Brand = p.Brand.Name,
                Category = p.Category.Name,
                ImageUrls = p.ImageUrls,
            })
            .OrderBy(p => p.CurrentStock)
            .Skip(request.PageIndex * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();

        var response = new PaginatedList
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = count,
            Items = result,
        };

        return Result<PaginatedList>.Success(response);
    }

    public async Task<Result<List<BrandPerformanceReportResponse>>> GetBrandPerformanceReportAsync(
        BrandPerformanceReportRequest request
    )
    {
        var parameters = new SqlParameter[]
        {
            new("@iStartDate", request.StartDate),
            new("@iEndDate", request.EndDate),
        };
        var reports = await _unitOfWork
            .GetRepository<BrandPerformanceReportResponse>()
            .ExecuteStoredProcedureAsync(StoredProcedure.GetBrandPerformanceReport, parameters);
        return Result<List<BrandPerformanceReportResponse>>.Success(reports.ToList());
    }

    public async Task<
        Result<List<CategoryPerformanceReportResponse>>
    > GetCategoryPerformanceReportAsync(CategoryPerformanceReportRequest request)
    {
        var parameters = new SqlParameter[]
        {
            new("@iStartDate", request.StartDate),
            new("@iEndDate", request.EndDate),
        };
        var reports = await _unitOfWork
            .GetRepository<CategoryPerformanceReportResponse>()
            .ExecuteStoredProcedureAsync(StoredProcedure.GetCategoryPerformanceReport, parameters);
        return Result<List<CategoryPerformanceReportResponse>>.Success(reports.ToList());
    }

    public async Task<Result<List<ProductRatingResponse>>> GetProductRatingReportAsync()
    {
        var reports = await _unitOfWork
            .GetRepository<Product>()
            .GetAll(x => x.Reviews.Any())
            .Select(p => new ProductRatingResponse
            {
                ProductId = p.Id,
                ProductName = p.Name,
                AverageRating = p.Reviews.Average(r => r.Rating),
                ReviewCount = p.Reviews.Count,
                RatingDistribution = new Dictionary<int, int>
                {
                    { 1, p.Reviews.Count(r => r.Rating == 1) },
                    { 2, p.Reviews.Count(r => r.Rating == 2) },
                    { 3, p.Reviews.Count(r => r.Rating == 3) },
                    { 4, p.Reviews.Count(r => r.Rating == 4) },
                    { 5, p.Reviews.Count(r => r.Rating == 5) },
                },
                PositiveSentimentPercentage =
                    (double)p.Reviews.Count(r => r.Rating >= 4) / p.Reviews.Count * 100,
                NegativeSentimentPercentage =
                    (double)p.Reviews.Count(r => r.Rating <= 2) / p.Reviews.Count * 100,
            })
            .OrderByDescending(p => p.AverageRating)
            .ToListAsync();
        return Result<List<ProductRatingResponse>>.Success(reports);
    }

    public async Task<Result<List<TopCustomerReportResponse>>> GetTopCustomerReportAsync(
        GetTopCustomerReportRequest request
    )
    {
        var parameters = new SqlParameter[]
        {
            new("@iStartDate", request.StartDate),
            new("@iEndDate", request.EndDate),
            new("@iCount", request.Count),
        };
        var result = await _unitOfWork
            .GetRepository<TopCustomerReportResponse>()
            .ExecuteStoredProcedureAsync(StoredProcedure.GetTopCustomerReport, parameters);
        return Result<List<TopCustomerReportResponse>>.Success(result.ToList());
    }

    public async Task<Result<PaginatedList>> GetTopSellingProductsAsync(
        TopSellingProductRequest request
    )
    {
        var query = _unitOfWork
            .GetRepository<OrderItem>()
            .GetAll()
            .Where(oi =>
                oi.Order!.CreatedDate >= request.StartDate
                && oi.Order.CreatedDate <= request.EndDate
                && oi.Order.Status == OrderStatus.Completed
            )
            .GroupBy(oi => oi.ProductId);
        var count = await query.CountAsync();
        var result = await query
            .Select(g => new TopSellingProductResponse
            {
                ProductId = g.Key,
                Sku = g.First().Product.Sku,
                ProductName = g.First().Product.Name,
                TotalQuantitySold = g.Sum(oi => oi.Quantity),
                TotalRevenue = g.Sum(oi => oi.Price * oi.Quantity),
                AverageRating = g.First().Product.Reviews.Any()
                    ? g.First().Product.Reviews.Average(r => r.Rating)
                    : 0,
            })
            .OrderByDescending(p => p.TotalQuantitySold)
            .Skip(request.PageIndex * request.PageSize)
            .Take(request.PageSize)
            .ToListAsync();
        var list = new PaginatedList
        {
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            TotalCount = count,
            Items = result,
        };
        return Result<PaginatedList>.Success(list);
    }
}

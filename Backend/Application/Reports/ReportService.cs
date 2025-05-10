using Application.Reports.Dtos;
using Application.Shared;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

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
                && !o.IsDeleted
            )
            .ToListAsync(cancellationToken);

        var allMonths = new List<DateTime>();
        for (var month = request.StartDate; month <= request.EndDate; month = month.AddMonths(1))
        {
            allMonths.Add(new DateTime(month.Year, month.Month, 1));
        }

        var groupedOrders = orders
            .GroupBy(o => new DateTime(o.CreatedDate.Year, o.CreatedDate.Month, 1))
            .ToDictionary(g => g.Key, g => g.ToList());

        var report = allMonths.ConvertAll(month =>
        {
            var monthlyOrders = groupedOrders.TryGetValue(month, out var value) ? value : [];

            var completedOrders = monthlyOrders
                .Where(o => o.Status == OrderStatus.Completed)
                .ToList();
            var totalRevenue = completedOrders.Sum(o => o.TotalPrice);
            var averageOrderValue =
                completedOrders.Count != 0 ? completedOrders.Average(o => o.TotalPrice) : 0;

            return new SaleReportResponse(
                month,
                totalRevenue,
                monthlyOrders.Count,
                completedOrders.Count(o => o.Status == OrderStatus.Completed),
                monthlyOrders.Count(o => o.Status == OrderStatus.Cancelled),
                averageOrderValue
            );
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
            new("@iCustomerUsername", (object?)request.CustomerUsername ?? DBNull.Value),
        };
        var reports = await _unitOfWork
            .GetRepository<OrderReportResponse>()
            .ExecuteStoredProcedureAsync(
                StoredProcedure.GetOrderReport,
                parameters,
                cancellationToken
            );

        return Result<List<OrderReportResponse>>.Success(reports.ToList());
    }

    public async Task<
        Result<PaginatedList<InventoryStatusReportResponse>>
    > GetInventoryStatusReportAsync(
        InventoryStatusReportRequest request,
        CancellationToken cancellationToken = default
    )
    {
        const int lowStockThreshold = 5;
        var query = _unitOfWork
            .GetRepository<Product>()
            .GetAll(x =>
                (request.BrandId == null || x.BrandId == request.BrandId)
                && (request.CategoryId == null || x.CategoryId == request.CategoryId)
            );
        var dtoQuery = query
            .OrderBy(p => p.Stock)
            .Select(p => new InventoryStatusReportResponse(
                p.Id,
                p.Sku,
                p.Name,
                p.Stock,
                p.Category.Name,
                p.Brand.Name,
                p.ImageUrls,
                p.Stock <= 0 ? "Out of Stock"
                    : p.Stock <= lowStockThreshold ? "Low Stock"
                    : "In Stock",
                p.Stock <= lowStockThreshold
            ));
        var result = await PaginatedList<InventoryStatusReportResponse>.CreateAsync(
            dtoQuery,
            request.PageIndex,
            request.PageSize,
            cancellationToken
        );

        return Result<PaginatedList<InventoryStatusReportResponse>>.Success(result);
    }

    public async Task<Result<List<BrandPerformanceReportResponse>>> GetBrandPerformanceReportAsync(
        BrandPerformanceReportRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var productQuery = _unitOfWork.GetRepository<Product>().GetAll();
        var orderItemQuery = _unitOfWork.GetRepository<OrderItem>().GetAll();
        var orderQuery = _unitOfWork.GetRepository<Order>().GetAll();
        var brandOrderStats = await _unitOfWork
            .GetRepository<Brand>()
            .GetAll()
            .GroupJoin(
                productQuery,
                b => b.Id,
                p => p.BrandId,
                (b, products) => new { Brand = b, Products = products }
            )
            .SelectMany(
                bp => bp.Products.DefaultIfEmpty(),
                (bp, p) => new { bp.Brand, Product = p }
            )
            .GroupJoin(
                orderItemQuery,
                bp => bp.Product.Id,
                oi => oi.ProductId,
                (bp, orderItems) =>
                    new
                    {
                        bp.Brand,
                        bp.Product,
                        OrderItems = orderItems,
                    }
            )
            .SelectMany(
                bpo => bpo.OrderItems.DefaultIfEmpty(),
                (bpo, oi) =>
                    new
                    {
                        bpo.Brand,
                        bpo.Product,
                        OrderItem = oi,
                    }
            )
            .GroupJoin(
                orderQuery.Where(o =>
                    o.CreatedDate >= request.StartDate
                    && o.CreatedDate <= request.EndDate
                    && o.Status == OrderStatus.Completed
                ),
                bpoi => bpoi.OrderItem.OrderId,
                o => o.Id,
                (bpoi, orders) =>
                    new
                    {
                        bpoi.Brand,
                        bpoi.Product,
                        bpoi.OrderItem,
                        Orders = orders,
                    }
            )
            .GroupBy(x => new { x.Brand.Id, x.Brand.Name })
            .Select(g => new
            {
                BrandId = g.Key.Id,
                BrandName = g.Key.Name,
                TotalRevenue = g.Sum(x =>
                    x.OrderItem != null ? x.OrderItem.Price * x.OrderItem.Quantity : 0
                ),
                TotalUnitsSold = g.Sum(x => x.OrderItem != null ? x.OrderItem.Quantity : 0),
            })
            .ToListAsync(cancellationToken);

        var productCounts = await productQuery
            .GroupBy(p => p.BrandId)
            .Select(g => new { BrandId = g.Key, ProductCount = g.Count() })
            .ToListAsync(cancellationToken);

        var brandRatings = await productQuery
            .Where(p => p.Reviews.Any())
            .GroupBy(p => p.BrandId)
            .Select(g => new
            {
                BrandId = g.Key,
                AverageRating = g.SelectMany(p => p.Reviews).Average(r => r.Rating),
            })
            .ToListAsync(cancellationToken);

        var result = brandOrderStats
            .GroupJoin(
                productCounts,
                bos => bos.BrandId,
                pc => pc.BrandId,
                (bos, pc) => new { bos, ProductCount = pc.FirstOrDefault()?.ProductCount ?? 0 }
            )
            .GroupJoin(
                brandRatings,
                x => x.bos.BrandId,
                br => br.BrandId,
                (x, br) =>
                    new BrandPerformanceReportResponse(
                        x.bos.BrandId,
                        x.bos.BrandName,
                        x.ProductCount,
                        x.bos.TotalRevenue,
                        x.bos.TotalUnitsSold,
                        br.FirstOrDefault()?.AverageRating ?? 0
                    )
            )
            .OrderByDescending(x => x.TotalRevenue)
            .ToList();

        return Result<List<BrandPerformanceReportResponse>>.Success(result);
    }

    public async Task<
        Result<List<CategoryPerformanceReportResponse>>
    > GetCategoryPerformanceReportAsync(
        CategoryPerformanceReportRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var productQuery = _unitOfWork.GetRepository<Product>().GetAll();
        var orderItemQuery = _unitOfWork.GetRepository<OrderItem>().GetAll();
        var orderQuery = _unitOfWork.GetRepository<Order>().GetAll();
        var categoryOrderStats = await _unitOfWork
            .GetRepository<Category>()
            .GetAll()
            .GroupJoin(
                productQuery,
                c => c.Id,
                p => p.CategoryId,
                (c, products) => new { Category = c, Products = products }
            )
            .SelectMany(
                cp => cp.Products.DefaultIfEmpty(),
                (cp, p) => new { cp.Category, Product = p }
            )
            .GroupJoin(
                orderItemQuery,
                cp => cp.Product.Id,
                oi => oi.ProductId,
                (cp, orderItems) =>
                    new
                    {
                        cp.Category,
                        cp.Product,
                        OrderItems = orderItems,
                    }
            )
            .SelectMany(
                cpo => cpo.OrderItems.DefaultIfEmpty(),
                (cpo, oi) =>
                    new
                    {
                        cpo.Category,
                        cpo.Product,
                        OrderItem = oi,
                    }
            )
            .GroupJoin(
                orderQuery.Where(o =>
                    o.CreatedDate >= request.StartDate
                    && o.CreatedDate <= request.EndDate
                    && o.Status == OrderStatus.Completed
                ),
                cpoi => cpoi.OrderItem.OrderId,
                o => o.Id,
                (cpoi, orders) =>
                    new
                    {
                        cpoi.Category,
                        cpoi.Product,
                        cpoi.OrderItem,
                        Orders = orders,
                    }
            )
            .GroupBy(x => new { x.Category.Id, x.Category.Name })
            .Select(g => new
            {
                CategoryId = g.Key.Id,
                CategoryName = g.Key.Name,
                TotalRevenue = g.Sum(x =>
                    x.OrderItem != null ? x.OrderItem.Price * x.OrderItem.Quantity : 0
                ),
                TotalUnitsSold = g.Sum(x => x.OrderItem != null ? x.OrderItem.Quantity : 0),
            })
            .ToListAsync(cancellationToken);

        var productCounts = await productQuery
            .GroupBy(p => p.CategoryId)
            .Select(g => new { CategoryId = g.Key, ProductCount = g.Count() })
            .ToListAsync(cancellationToken);

        var categoryRatings = await productQuery
            .Where(p => p.Reviews.Any())
            .GroupBy(p => p.CategoryId)
            .Select(g => new
            {
                CategoryId = g.Key,
                AverageRating = g.SelectMany(p => p.Reviews).Average(r => r.Rating),
            })
            .ToListAsync(cancellationToken);

        var result = categoryOrderStats
            .GroupJoin(
                productCounts,
                cos => cos.CategoryId,
                pc => pc.CategoryId,
                (cos, pc) => new { cos, ProductCount = pc.FirstOrDefault()?.ProductCount ?? 0 }
            )
            .GroupJoin(
                categoryRatings,
                x => x.cos.CategoryId,
                cr => cr.CategoryId,
                (x, cr) =>
                    new CategoryPerformanceReportResponse(
                        x.cos.CategoryId,
                        x.cos.CategoryName,
                        x.ProductCount,
                        x.cos.TotalRevenue,
                        x.cos.TotalUnitsSold,
                        cr.FirstOrDefault()?.AverageRating ?? 0
                    )
            )
            .OrderByDescending(x => x.TotalRevenue)
            .ToList();

        return Result<List<CategoryPerformanceReportResponse>>.Success(result);
    }

    public async Task<Result<List<ProductRatingReportResponse>>> GetProductRatingReportAsync(
        CancellationToken cancellationToken = default
    )
    {
        var reports = await _unitOfWork
            .GetRepository<Product>()
            .GetAll(x => x.Reviews.Any())
            .OrderByDescending(p => p.Reviews.Average(r => r.Rating))
            .Select(p => new ProductRatingReportResponse(
                p.Id,
                p.Name,
                p.Reviews.Average(r => r.Rating),
                p.Reviews.Count,
                new Dictionary<int, int>
                {
                    { 1, p.Reviews.Count(r => r.Rating == 1) },
                    { 2, p.Reviews.Count(r => r.Rating == 2) },
                    { 3, p.Reviews.Count(r => r.Rating == 3) },
                    { 4, p.Reviews.Count(r => r.Rating == 4) },
                    { 5, p.Reviews.Count(r => r.Rating == 5) },
                },
                Convert.ToDouble(p.Reviews.Count(r => r.Rating >= 4) / p.Reviews.Count) * 100,
                Convert.ToDouble(p.Reviews.Count(r => r.Rating <= 2) / p.Reviews.Count) * 100
            ))
            .ToListAsync(cancellationToken);
        return Result<List<ProductRatingReportResponse>>.Success(reports);
    }

    public async Task<Result<List<TopCustomerReportResponse>>> GetTopCustomerReportAsync(
        GetTopCustomerReportRequest request,
        CancellationToken cancellationToken = default
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
            .ExecuteStoredProcedureAsync(
                StoredProcedure.GetTopCustomerReport,
                parameters,
                cancellationToken
            );
        return Result<List<TopCustomerReportResponse>>.Success(result.ToList());
    }

    public async Task<Result<PaginatedList<TopSellingProductResponse>>> GetTopSellingProductsAsync(
        TopSellingProductRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var query = _unitOfWork
            .GetRepository<OrderItem>()
            .GetAll(oi =>
                oi.Order!.CreatedDate >= request.StartDate
                && oi.Order.CreatedDate <= request.EndDate
                && oi.Order.Status == OrderStatus.Completed
            )
            .GroupBy(oi => oi.ProductId);
        var dtoQuery = query
            .Select(g => new TopSellingProductResponse(
                g.Key,
                g.First().Product.Sku,
                g.First().Product.Name,
                g.Sum(oi => oi.Quantity),
                g.Sum(oi => oi.Price * oi.Quantity),
                g.First().Product.Reviews.Any()
                    ? g.First().Product.Reviews.Average(r => r.Rating)
                    : 0
            ))
            .OrderByDescending(p => p.TotalQuantitySold);
        var result = await PaginatedList<TopSellingProductResponse>.CreateAsync(
            dtoQuery,
            request.PageIndex,
            request.PageSize,
            cancellationToken
        );
        return Result<PaginatedList<TopSellingProductResponse>>.Success(result);
    }
}

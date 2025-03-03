using Application.Reports.Dtos;
using Shared;

namespace Application.Reports;

public interface IReportService
{
    Task<Result<List<SaleReportResponse>>> GetSaleReportsAsync(
        SaleReportRequest request,
        CancellationToken cancellationToken = default
    );
    Task<Result<List<OrderReportResponse>>> GetOrderReportsAsync(
        OrderReportRequest request,
        CancellationToken cancellationToken = default
    );
    Task<Result<PaginatedList>> GetOutOfStockReportAsync(OutOfStockReportRequest request);
    Task<Result<List<BrandPerformanceReportResponse>>> GetBrandPerformanceReportAsync(
        BrandPerformanceReportRequest request
    );
    Task<Result<List<CategoryPerformanceReportResponse>>> GetCategoryPerformanceReportAsync(
        CategoryPerformanceReportRequest request
    );
    Task<Result<List<ProductRatingResponse>>> GetProductRatingReportAsync();
    Task<Result<List<TopCustomerReportResponse>>> GetTopCustomerReportAsync(
        GetTopCustomerReportRequest request
    );
}

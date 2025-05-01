using Application.Reports.Dtos;
using Application.Shared;

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

    Task<Result<PaginatedList<InventoryStatusReportResponse>>> GetInventoryStatusReportAsync(InventoryStatusReportRequest request,
        CancellationToken cancellationToken = default
    );

    Task<Result<List<BrandPerformanceReportResponse>>> GetBrandPerformanceReportAsync(
        BrandPerformanceReportRequest request,
        CancellationToken cancellationToken = default
    );

    Task<Result<List<CategoryPerformanceReportResponse>>> GetCategoryPerformanceReportAsync(
        CategoryPerformanceReportRequest request,
        CancellationToken cancellationToken = default
    );

    Task<Result<List<ProductRatingReportResponse>>>
        GetProductRatingReportAsync(CancellationToken cancellationToken = default);

    Task<Result<List<TopCustomerReportResponse>>> GetTopCustomerReportAsync(
        GetTopCustomerReportRequest request,
        CancellationToken cancellationToken = default
    );

    Task<Result<PaginatedList<TopSellingProductResponse>>> GetTopSellingProductsAsync(TopSellingProductRequest request,
        CancellationToken cancellationToken = default);
}
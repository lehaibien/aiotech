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
    Task<Result<List<LowRatingProductReportResponse>>> GetLowRatingProductsAsync(
        LowRatingProductReportRequest request,
        CancellationToken cancellationToken = default
    );
}

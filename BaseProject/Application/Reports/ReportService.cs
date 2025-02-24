using Application.Reports.Dtos;
using AutoDependencyRegistration.Attributes;
using Domain.Entities;
using Domain.UnitOfWork;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Shared;

namespace Application.Reports;

[RegisterClassAsScoped]
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
        var parameters = new SqlParameter[]
        {
            new("@iStartDate", request.StartDate),
            new("@iEndDate", request.EndDate),
            new("@iProduct", request.Product is null ? DBNull.Value : request.Product),
            new("@iCategory", request.Category is null ? DBNull.Value : request.Category),
        };
        var reports = await _unitOfWork
            .GetRepository<SaleReportResponse>()
            .ExecuteStoredProcedureAsync(StoredProcedure.GetSaleReport, parameters);

        return Result<List<SaleReportResponse>>.Success(reports.ToList());
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

    public async Task<Result<List<LowRatingProductReportResponse>>> GetLowRatingProductsAsync(
        LowRatingProductReportRequest request,
        CancellationToken cancellationToken = default
    )
    {
        var parameters = new SqlParameter[]
        {
            new("@iStartDate", request.StartDate),
            new("@iEndDate", request.EndDate),
            new("@iBrandId", request.BrandId is null ? DBNull.Value : request.BrandId),
            new("@iCategoryId", request.CategoryId is null ? DBNull.Value : request.CategoryId),
        };
        var reports = await _unitOfWork
            .GetRepository<LowRatingProductReportResponse>()
            .ExecuteStoredProcedureAsync(StoredProcedure.GetLowRatingProductReport, parameters);

        return Result<List<LowRatingProductReportResponse>>.Success(reports.ToList());
    }
}

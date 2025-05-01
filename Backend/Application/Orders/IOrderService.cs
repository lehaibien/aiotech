using Application.Orders.Dtos;
using Application.Shared;
using Domain.Entities;
using Microsoft.AspNetCore.Http;

namespace Application.Orders;

public interface IOrderService
{
    Task<Result<PaginatedList<OrderResponse>>> GetListAsync(
        OrderGetListRequest request,
        CancellationToken cancellationToken = default
    );

    Task<Result<OrderDetailResponse>> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);

    Task<Result<List<OrderResponse>>> GetByUsernameAsync(string username,
        CancellationToken cancellationToken = default);

    Task<Result<List<OrderResponse>>> GetRecentOrdersAsync(int count,
        CancellationToken cancellationToken = default);

    Task<Result<string>> CreateUrlAsync(OrderCheckoutRequest request);
    Task<Result<OrderResponse>> CreateAsync(OrderRequest request);

    Task<Result<OrderResponse>> UpdateAsync(OrderRequest request);
    Task<Result<string>> DeleteAsync(Guid id);
    Task<Result<string>> DeleteListAsync(List<Guid> ids);
    Task<Result> ChangeStatusAsync(OrderUpdateStatusRequest request);
    Task<Result<string>> ChangeStatusListAsync(List<Guid> ids, OrderStatus status);
    Task<Result<byte[]>> PrintReceiptAsync(Guid id);
    Task<Result> HandleCallbackPaymentAsync(IQueryCollection queryCollection);
    Task<Result> ConfirmAsync(Guid id);
    Task<Result> CancelAsync(OrderCancelRequest request);
}
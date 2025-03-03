using Application.Orders.Dtos;
using Domain.Entities;
using Microsoft.AspNetCore.Http;
using Shared;

namespace Application.Orders;

public interface IOrderService
{
    Task<Result<PaginatedList>> GetList(OrderGetListRequest request);
    Task<Result<OrderResponse>> GetById(Guid id);
    Task<Result<List<OrderResponse>>> GetByUsername(string username);
    Task<Result<List<OrderResponse>>> GetRecentOrders(int count);
    Task<Result<string>> CreateUrl(OrderCheckoutRequest request);
    Task<Result<OrderResponse>> Create(OrderRequest request);

    Task<Result<OrderResponse>> Update(OrderRequest request);
    Task<Result<string>> Delete(Guid id);
    Task<Result<string>> DeleteList(List<Guid> ids);
    Task<Result> ChangeStatus(OrderUpdateStatusRequest request);
    Task<Result<string>> ChangeStatusList(List<Guid> ids, OrderStatus status);
    Task<Result<byte[]>> PrintReceipt(Guid id);
    Task<Result> HandleCallbackPayment(IQueryCollection queryCollection);
    Task<Result> Cancel(OrderCancelRequest request);
}

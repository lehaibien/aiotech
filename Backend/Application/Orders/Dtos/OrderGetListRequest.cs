using Application.Shared;
using Domain.Entities;

namespace Application.Orders.Dtos;

public class OrderGetListRequest : GetListRequest
{
    public Guid? CustomerId { get; set; }
    public List<OrderStatus> Statuses { get; set; } = [];
}
using Domain.Entities;
using Shared;

namespace Application.Orders.Dtos;

public class OrderGetListRequest : GetListRequest
{
    public Guid? CustomerId { get; set; }
    public List<OrderStatus> Statuses { get; set; } = [];
}

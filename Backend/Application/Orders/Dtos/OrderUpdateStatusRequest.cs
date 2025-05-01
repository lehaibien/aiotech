using Domain.Entities;

namespace Application.Orders.Dtos;

public class OrderUpdateStatusRequest
{
    public Guid Id { get; set; }
    public OrderStatus Status { get; set; }
}
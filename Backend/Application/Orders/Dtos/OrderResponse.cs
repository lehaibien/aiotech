﻿using Application.Shared;
using Domain.Entities;

namespace Application.Orders.Dtos;

public class OrderResponse : BaseResponse
{
    public Guid Id { get; set; }
    public string TrackingNumber { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string? PhoneNumber { get; set; }
    public string? PaymentProvider { get; set; } = Domain.Entities.PaymentProvider.Cod.ToString();
    public string Address { get; set; } = null!;
    public decimal Tax { get; set; }
    public decimal TotalPrice { get; set; }
    public string Status { get; set; } = OrderStatus.Pending.ToString();
    public DateTime? DeliveryDate { get; set; }
    public string? Note { get; set; }
    public string? CancelReason { get; set; }

    public List<OrderItemResponse> OrderItems { get; set; } = [];
}

public class OrderItemResponse
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = null!;
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public decimal TotalPrice => Price * Quantity;
}
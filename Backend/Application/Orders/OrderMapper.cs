using Application.Orders.Dtos;
using Domain.Entities;

namespace Application.Orders;

public static class OrderMapper
{
    public static OrderResponse MapToOrderResponse(this Order order)
    {
        return new OrderResponse
        {
            Id = order.Id,
            TrackingNumber = order.TrackingNumber,
            Name = order.Name,
            PhoneNumber = order.PhoneNumber,
            Address = order.Address,
            Tax = order.Tax,
            TotalPrice = order.TotalPrice,
            Status = order.Status.ToString(),
            Note = order.Note,
            DeliveryDate = order.DeliveryDate,
            CancelReason = order.CancelReason,
            PaymentProvider = order.Payment.Provider.ToString(),
            CreatedDate = order.CreatedDate,
            CreatedBy = order.CreatedBy,
            UpdatedDate = order.UpdatedDate,
            UpdatedBy = order.UpdatedBy,
        };
    }

    public static OrderResponse MapToOrderResponseWithOrderItems(this Order order)
    {
        return new OrderResponse
        {
            Id = order.Id,
            TrackingNumber = order.TrackingNumber,
            Name = order.Name,
            PhoneNumber = order.PhoneNumber,
            Address = order.Address,
            Tax = order.Tax,
            TotalPrice = order.TotalPrice,
            Status = order.Status.ToString(),
            Note = order.Note,
            DeliveryDate = order.DeliveryDate,
            CancelReason = order.CancelReason,
            PaymentProvider = order.Payment.Provider.ToString(),
            CreatedDate = order.CreatedDate,
            CreatedBy = order.CreatedBy,
            UpdatedDate = order.UpdatedDate,
            UpdatedBy = order.UpdatedBy,
            OrderItems = order
                .OrderItems.Select(y => new OrderItemResponse
                {
                    Id = y.Id,
                    ProductId = y.ProductId,
                    ProductName = y.Product.Name,
                    Price = (double)y.Product.Price,
                    Quantity = y.Quantity,
                })
                .ToList(),
        };
    }

    // Request

    public static Order MapToOrder(this OrderCheckoutRequest request)
    {
        return new Order
        {
            Id = request.Id == Guid.Empty ? Guid.NewGuid() : request.Id,
            Name = request.Name,
            PhoneNumber = request.PhoneNumber,
            Tax = request.Tax,
            TotalPrice = request.TotalPrice,
            CustomerId = request.CustomerId,
            Address = request.Address,
            Status = OrderStatus.Pending,
            Note = request.Note,
        };
    }

    public static Order MapToOrder(this OrderRequest request)
    {
        return new Order
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            PhoneNumber = request.PhoneNumber,
            Address = request.Address,
            Tax = request.Tax,
            TotalPrice = request.TotalPrice,
            Status = OrderStatus.Pending,
            Note = request.Note,
            DeliveryDate = request.DeliveryDate,
            CustomerId = request.CustomerId,
        };
    }

    public static OrderItem MapToOrderItem(this OrderItemRequest request)
    {
        return new OrderItem
        {
            Id = Guid.NewGuid(),
            ProductId = request.ProductId,
            Quantity = request.Quantity,
        };
    }

    // Projection
    public static IQueryable<OrderResponse> ProjectToOrderResponse(this IQueryable<Order> query)
    {
        return query.Select(ord => new OrderResponse
        {
            Id = ord.Id,
            TrackingNumber = ord.TrackingNumber,
            Name = ord.Name,
            PhoneNumber = ord.PhoneNumber,
            Address = ord.Address,
            Tax = ord.Tax,
            TotalPrice = ord.TotalPrice,
            Status = ord.Status.ToString(),
            Note = ord.Note,
            DeliveryDate = ord.DeliveryDate,
            CancelReason = ord.CancelReason,
            PaymentProvider = ord.Payment.Provider.ToString(),
            CreatedDate = ord.CreatedDate,
            CreatedBy = ord.CreatedBy,
            UpdatedDate = ord.UpdatedDate,
            UpdatedBy = ord.UpdatedBy,
        });
    }

    public static IQueryable<OrderResponse> ProjectToOrderResponseWithOrderItems(
        this IQueryable<Order> query
    )
    {
        return query.Select(ord => new OrderResponse
        {
            Id = ord.Id,
            TrackingNumber = ord.TrackingNumber,
            Name = ord.Name,
            PhoneNumber = ord.PhoneNumber,
            Address = ord.Address,
            Tax = ord.Tax,
            TotalPrice = ord.TotalPrice,
            Status = ord.Status.ToString(),
            Note = ord.Note,
            DeliveryDate = ord.DeliveryDate,
            CancelReason = ord.CancelReason,
            PaymentProvider = ord.Payment.Provider.ToString(),
            CreatedDate = ord.CreatedDate,
            CreatedBy = ord.CreatedBy,
            UpdatedDate = ord.UpdatedDate,
            UpdatedBy = ord.UpdatedBy,
            OrderItems = ord
                .OrderItems.Select(item => new OrderItemResponse
                {
                    Id = item.Id,
                    ProductId = item.ProductId,
                    ProductName = item.Product.Name,
                    Price = (double)item.Product.Price,
                    Quantity = item.Quantity,
                })
                .ToList(),
        });
    }
}

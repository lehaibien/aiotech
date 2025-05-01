namespace Application.Orders.Dtos;

public record OrderDetailResponse(
    Guid Id,
    string TrackingNumber,
    string Name,
    string PhoneNumber,
    string Address,
    decimal Tax,
    decimal TotalPrice,
    string Status,
    DateTime? DeliveryDate,
    string PaymentProvider,
    string? Note,
    DateTime CreatedDate,
    IEnumerable<OrderItemResponse> OrderItems
);
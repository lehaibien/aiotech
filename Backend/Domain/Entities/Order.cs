namespace Domain.Entities;

public class Order : BaseEntity
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public string TrackingNumber { get; set; } = null!;
    public string Name { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public string Address { get; set; } = null!;
    public decimal Tax { get; set; }
    public decimal TotalPrice { get; set; }
    public OrderStatus Status { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public string? Note { get; set; }
    public string? CancelReason { get; set; }

    public User Customer { get; set; } = null!;
    public Payment? Payment { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; } = [];
}

public enum OrderStatus
{
    Pending,
    Paid,
    Processing,
    Delivering,
    Delivered,
    Completed,
    Cancelled,
}

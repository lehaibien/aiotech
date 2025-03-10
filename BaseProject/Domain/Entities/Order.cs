namespace Domain.Entities;

public class Order : BaseEntity
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public string TrackingNumber { get; set; } = null!;
    public string? Name { get; set; }
    public string? PhoneNumber { get; set; }
    public string Address { get; set; } = null!;
    public double Tax { get; set; }
    public double TotalPrice { get; set; }
    public OrderStatus Status { get; set; }
    public DateTime? DeliveryDate { get; set; }
    public string? Note { get; set; }
    public string? CancelReason { get; set; }

    // Navigation properties
    public virtual User Customer { get; set; } = null!;
    public virtual Payment? Payment { get; set; }
    public virtual ICollection<OrderItem> OrderItems { get; set; } = [];
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

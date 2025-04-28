using System.ComponentModel.DataAnnotations;
using Domain.Entities;

namespace Application.Orders.Dtos;

public class OrderCheckoutRequest
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public decimal Tax { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Thành tiền phải lớn hơn hoặc bằng 0")]
    public decimal TotalPrice { get; set; }

    public OrderStatus? Status { get; set; } = OrderStatus.Pending;
    public DateTime? DeliveryDate { get; set; }
    public string? Name { get; set; }
    public string? PhoneNumber { get; set; }

    [Required(AllowEmptyStrings = false, ErrorMessage = "Địa chỉ không được để trống")]
    public string Address { get; set; } = null!;

    public string? Note { get; set; }
    public PaymentProvider Provider { get; set; }

    public string? CouponCode { get; set; }

    public List<OrderItemRequest> OrderItems { get; set; } = [];
}

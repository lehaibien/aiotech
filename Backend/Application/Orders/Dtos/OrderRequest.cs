using System.ComponentModel.DataAnnotations;
using Domain.Entities;

namespace Application.Orders.Dtos;

public class OrderRequest
{
    public Guid Id { get; set; }
    public Guid CustomerId { get; set; }
    public string Name { get; set; } = null!;
    public string PhoneNumber { get; set; } = null!;
    public string Address { get; set; } = null!;
    public decimal Tax { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Thành tiền phải lớn hơn hoặc bằng 0")]
    public decimal TotalPrice { get; set; }

    public OrderStatus Status { get; set; } = OrderStatus.Pending;
    public DateTime? DeliveryDate { get; set; }

    [Required(AllowEmptyStrings = false, ErrorMessage = "Địa chỉ không được để trống")]
    public string? Note { get; set; }

    public List<OrderItemRequest> OrderItems { get; set; } = [];
}

public class OrderItemRequest
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }

    [Range(1, int.MaxValue, ErrorMessage = "Số lượng sản phẩm phải lớn hơn 0")]
    public int Quantity { get; set; }

    [Range(0, double.MaxValue, ErrorMessage = "Giá sản phẩm phải lớn hơn hoặc bằng 0")]
    public decimal Price { get; set; }
}

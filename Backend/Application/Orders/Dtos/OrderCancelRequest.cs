using System.ComponentModel.DataAnnotations;

namespace Application.Orders.Dtos;

public class OrderCancelRequest
{
    public Guid Id { get; set; }

    [Required(AllowEmptyStrings = false, ErrorMessage = "Lý do hủy đơn hàng không được để trống")]
    public string Reason { get; set; } = null!;
}
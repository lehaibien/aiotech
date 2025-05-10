namespace Application.Carts.Dtos;

public class CartRequest
{
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
    public int? Quantity { get; set; }
}

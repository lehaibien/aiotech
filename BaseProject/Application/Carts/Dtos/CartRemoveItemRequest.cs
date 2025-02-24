namespace Application.Carts.Dtos;

public class CartRemoveItemRequest
{
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
}
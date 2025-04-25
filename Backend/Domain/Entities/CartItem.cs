namespace Domain.Entities;

public class CartItem
{
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
    public int Quantity { get; set; }

    public virtual User User { get; set; } = null!;
    public virtual Product Product { get; set; } = null!;
}

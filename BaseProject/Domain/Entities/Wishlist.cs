namespace Domain.Entities;

public class Wishlist
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }

    // Navigation properties
    public virtual User? User { get; set; }
    public virtual ICollection<Product> Products { get; set; } = [];
}

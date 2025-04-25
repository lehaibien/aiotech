namespace Domain.Entities;

public class WishlistItem
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }

    public User User { get; set; } = null!;
    public Product Product { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}

namespace Domain.Entities;

public class User : BaseEntity
{
    public Guid Id { get; set; }
    public string UserName { get; set; } = null!;
    public string? FamilyName { get; set; }
    public string GivenName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? PhoneNumber { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Address { get; set; }
    public string Password { get; set; } = null!;
    public string Salt { get; set; } = null!;
    public Guid RoleId { get; set; }
    public bool IsLocked { get; set; }

    public Role Role { get; set; } = null!;
    public ICollection<Order> Orders { get; set; } = [];
    public ICollection<Review> Reviews { get; set; } = [];
    public ICollection<WishlistItem> WishlistItems { get; set; } = [];
}

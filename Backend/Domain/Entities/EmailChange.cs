namespace Domain.Entities;

public class EmailChange
{
    public Guid UserId { get; set; }
    public string OldEmail { get; set; } = null!;
    public string NewEmail { get; set; } = null!;
    public string Token { get; set; } = null!;
    public DateTime CreatedDate { get; set; }
    public DateTime ExpiryDate { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
}

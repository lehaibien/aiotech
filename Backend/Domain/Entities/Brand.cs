namespace Domain.Entities;

public class Brand : BaseEntity
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;

    // Navigation properties
    public virtual ICollection<Product> Products { get; set; } = [];
}

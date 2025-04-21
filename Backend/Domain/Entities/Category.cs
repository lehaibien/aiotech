namespace Domain.Entities;

public class Category : BaseEntity
{
    public Guid Id { get; set; }
    public string Name { get; set; } = null!;
    public string ImageUrl { get; set; } = null!;

    public ICollection<Product> Products { get; set; } = [];
}
